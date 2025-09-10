'use client';

import { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';

export default function AuthPage() {

	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loginError, setLoginError] = useState('');
	const [loginLoading, setLoginLoading] = useState(false);

	const handleLogin = async (e: React.FormEvent) => {

		e.preventDefault();
		setLoginLoading(true);
		setLoginError('');

		try {
			const response = await fetch('/api/auth', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password })
			});

			const data = await response.json();

			if (response.ok) {
				setIsAuthenticated(true);
				window.location.href = '/admin';
			} else {
				setLoginError(data.error || 'Erreur de connexion');
			}
		} catch (error) {
			setLoginError('Erreur de connexion');
		} finally {
			setLoginLoading(false);
		}
	};

	

	useEffect(() => {
		// Check if user is already authenticated via cookie
		const checkAuth = async () => {
			try {
				const response = await fetch('/api/auth/verify');
				if (response.ok) {
					setIsAuthenticated(true);
				}
			} catch (error) {
				// Not authenticated
			}
		};
		checkAuth();
	}, []);

	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center">
			<div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
				<div className="text-center mb-6">
					<Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
					<h1 className="text-2xl font-bold text-gray-900">Admin Access</h1>
					<p className="text-gray-600">Entrez vos identifiants pour accéder</p>
					<p className="text-sm text-gray-500 mt-2">Email par défaut: admin@goldenmove.com</p>
				</div>
				<form onSubmit={handleLogin}>
					<input
						type="email"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
						required
					/>
					<input
						type="password"
						placeholder="Mot de passe"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
						required
					/>
					{loginError && (
						<div className="text-red-600 text-sm mb-4">{loginError}</div>
					)}
					<button
						type="submit"
						disabled={loginLoading}
						className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
					>
						{loginLoading ? 'Connexion...' : 'Se connecter'}
					</button>
				</form>
			</div>
		</div>
	);
}
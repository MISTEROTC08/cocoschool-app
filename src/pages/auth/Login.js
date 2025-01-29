import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import {
  Card,
  Button,
  Input,
  Select,
  Alert,
} from '@/components/ui';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password, role);
    } catch (err) {
      setError('Erreur de connexion. Vérifiez vos identifiants.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-center mb-8">
          Connexion à CoCoSchool
        </h1>

        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Je suis un(e)
            </label>
            <Select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1"
            >
              <option value="student">Élève</option>
              <option value="parent">Parent</option>
              <option value="teacher">Professeur</option>
            </Select>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link 
            to="/forgot-password"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Mot de passe oublié ?
          </Link>
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Pas encore de compte ?{' '}
            <Link 
              to="/register"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              S'inscrire
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Login;
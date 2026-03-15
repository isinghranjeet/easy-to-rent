// src/components/debug/BackendTester.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

const BackendTester = () => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    email: 'test@example.com',
    password: 'test123'
  });

  const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:10000';

  const endpoints = [
    { path: '/', method: 'GET', description: 'Root endpoint' },
    { path: '/health', method: 'GET', description: 'Health check' },
    { path: '/api/auth', method: 'GET', description: 'Auth base' },
    { path: '/api/auth/login', method: 'POST', description: 'Login endpoint' },
    { path: '/api/auth/register', method: 'POST', description: 'Register endpoint' },
    { path: '/api/pg', method: 'GET', description: 'PG list' },
  ];

  const testEndpoint = async (endpoint: typeof endpoints[0]) => {
    try {
      const url = `${BASE_URL}${endpoint.path}`;
      console.log(`Testing: ${endpoint.method} ${url}`);
      
      const options: RequestInit = {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
      };

      // Add body for POST requests
      if (endpoint.method === 'POST') {
        options.body = JSON.stringify({
          email: loginData.email,
          password: loginData.password
        });
      }

      const startTime = Date.now();
      const response = await fetch(url, options);
      const endTime = Date.now();

      let data;
      try {
        data = await response.json();
      } catch {
        data = await response.text();
      }

      return {
        endpoint: endpoint.path,
        method: endpoint.method,
        status: response.status,
        statusText: response.statusText,
        time: endTime - startTime,
        data,
        success: response.ok
      };

    } catch (error: any) {
      return {
        endpoint: endpoint.path,
        method: endpoint.method,
        error: error.message,
        success: false
      };
    }
  };

  const testAllEndpoints = async () => {
    setLoading(true);
    setResults([]);
    
    const newResults = [];
    for (const endpoint of endpoints) {
      const result = await testEndpoint(endpoint);
      newResults.push(result);
      setResults([...newResults]);
    }
    
    setLoading(false);
  };

  const testLogin = async () => {
    setLoading(true);
    
    // Try different login request formats
    const loginFormats = [
      { email: loginData.email, password: loginData.password },
      { username: loginData.email, password: loginData.password },
      { user: { email: loginData.email, password: loginData.password } },
      { data: { email: loginData.email, password: loginData.password } }
    ];

    const loginResults = [];

    for (const format of loginFormats) {
      try {
        const response = await fetch(`${BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(format)
        });

        const data = await response.json();
        loginResults.push({
          format: JSON.stringify(format),
          status: response.status,
          data
        });
      } catch (error: any) {
        loginResults.push({
          format: JSON.stringify(format),
          error: error.message
        });
      }
    }

    setResults(loginResults);
    setLoading(false);
  };

  return (
    <Card className="max-w-4xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>🔍 Backend Connection Tester</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="Email"
              value={loginData.email}
              onChange={(e) => setLoginData({...loginData, email: e.target.value})}
              className="flex-1"
            />
            <Input
              placeholder="Password"
              type="password"
              value={loginData.password}
              onChange={(e) => setLoginData({...loginData, password: e.target.value})}
              className="flex-1"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={testAllEndpoints} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Test All Endpoints
            </Button>
            <Button onClick={testLogin} variant="outline" disabled={loading}>
              Test Login Formats
            </Button>
          </div>
        </div>

        {results.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold">Results:</h3>
            {results.map((result, index) => (
              <Alert key={index} variant={result.status === 200 ? "default" : "destructive"}>
                <AlertDescription>
                  <div className="space-y-2">
                    <div className="font-mono text-sm">
                      {result.method || 'POST'} {result.endpoint || '/api/auth/login'} - Status: {result.status || 'Error'}
                      {result.time && ` (${result.time}ms)`}
                    </div>
                    {result.error && (
                      <div className="text-red-500 text-sm">Error: {result.error}</div>
                    )}
                    {result.data && (
                      <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    )}
                    {result.format && (
                      <div className="text-xs text-gray-500">Format: {result.format}</div>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        <div className="text-sm text-gray-500 mt-4">
          <p>Base URL: {BASE_URL}</p>
          <p className="mt-2">If all endpoints return 404, your backend might not be running or deployed correctly on Render.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BackendTester;
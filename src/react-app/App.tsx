// src/App.tsx
import { useState, useEffect } from 'react';

function App() {
  const [name, setName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 调用API获取用户名
    const fetchUserName = async () => {
      try {
        const response = await fetch('https://api.aicoat.top/api');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setName(data[0].name);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchUserName();
  }, []); // 空依赖数组表示只在组件挂载时执行一次

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>User Information</h1>
      <p>Name from API is: {name || 'Not available'}</p>
    </div>
  );
}

export default App;
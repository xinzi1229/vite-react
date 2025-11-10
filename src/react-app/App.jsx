import React, { useState, useEffect } from 'react'; // 1. 导入需要的 hooks

// 2. 定义 User 类型（最佳实践）

function App() {
  // 3. 创建 state 来存储用户数据、加载状态和错误信息
  const [users, setUsers] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 4. 使用 useEffect 在组件加载后获取数据
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // 调用你的 Worker API
        const response = await fetch('/api/user');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUsers(data.users); // 假设 API 返回 { users: [...] }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []); // 空依赖数组表示这个 effect 只在组件首次渲染时运行一次

  // 5. 根据状态渲染不同的 UI
  if (loading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="App">
      <h1>Users from Database</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} ({user.phone})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
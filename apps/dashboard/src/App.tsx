import type { AppStatusResponse } from '@repo/shared-types';

function App() {
  const appStatus: AppStatusResponse = {
    message: 'API is running',
    status: 'OK',
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>SaaS Analytics Dashboard</h1>
      <p>Status: Ready</p>
      <p>
        API contract: {appStatus.message} ({appStatus.status})
      </p>
    </div>
  );
}

export default App;

const { useState, useEffect, useRef } = React;

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const chartRef = useRef(null);
  const chartInstance = useRef(null);   // ✅ better than state

  // Add task
  const addTask = () => {
    if (input.trim() === '') return;
    setTasks([...tasks, { id: Date.now(), text: input, done: false }]);
    setInput('');
  };

  // Toggle done
  const toggleDone = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  // Delete task
  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  // Update chart
  useEffect(() => {
    const done = tasks.filter(t => t.done).length;
    const pending = tasks.length - done;

    const data = {
      labels: ['Completed', 'Pending'],
      datasets: [{
        label: 'Tasks Status',
        data: [done, pending],
        backgroundColor: ['#4caf50', '#ff9800'],
      }]
    };

    if (chartInstance.current) {
      chartInstance.current.data = data;
      chartInstance.current.update();
    } else {
      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: {
          responsive: true,
          plugins: { legend: { position: 'bottom' } }
        }
      });
    }
  }, [tasks]);

  return (
    <div style={{ fontFamily: 'Arial', padding: '20px', maxWidth: '900px', margin: 'auto' }}>
      <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>
        Task Dashboard
      </h2>

      {/* Input */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Add a task"
          style={{
            padding: '10px',
            width: '60%',
            marginRight: '10px',
            borderRadius: '8px',
            border: '1px solid #ccc'
          }}
        />
        <button
          onClick={addTask}
          style={{
            padding: '10px 16px',
            borderRadius: '8px',
            border: 'none',
            background: '#4caf50',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          Add
        </button>
      </div>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {/* Tasks */}
        <div style={{ flex: '1 1 400px' }}>
          <h3>Tasks ({tasks.length})</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {tasks.map(task => (
              <li key={task.id} style={{
                background: task.done ? '#e0f7e9' : '#f9f9f9',
                padding: '12px',
                marginBottom: '10px',
                borderRadius: '10px',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span
                  onClick={() => toggleDone(task.id)}
                  style={{
                    textDecoration: task.done ? 'line-through' : 'none',
                    cursor: 'pointer'
                  }}
                >
                  {task.text}
                </span>
                <button
                  onClick={() => deleteTask(task.id)}
                  style={{
                    background: 'red',
                    color: 'white',
                    border: 'none',
                    padding: '6px 10px',
                    borderRadius: '6px'
                  }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Chart */}
        <div style={{ flex: '0 0 300px', textAlign: 'center' }}>
          <h3>Task Status</h3>
          <canvas ref={chartRef}></canvas>
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Dashboard />);

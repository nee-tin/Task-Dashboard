const { useState, useEffect, useRef } = React;

function Dashboard() {
const [tasks, setTasks] = useState([]);
const [input, setInput] = useState('');
const chartRef = useRef(null);
const [chartInstance, setChartInstance] = useState(null);

// Add task
const addTask = () => {
if(input.trim() === '') return;
setTasks([...tasks, { id: Date.now(), text: input, done: false }]);
setInput('');
};

// Toggle done
const toggleDone = (id) => {
setTasks(tasks.map(t => t.id === id ? {...t, done: !t.done} : t));
};

// Delete task
const deleteTask = (id) => {
setTasks(tasks.filter(t => t.id !== id));
};

// Update chart whenever tasks change
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

if(chartInstance) {
chartInstance.data = data;
chartInstance.update();
} else {
const ctx = chartRef.current.getContext('2d');
const newChart = new Chart(ctx, {
type: 'doughnut',
data: data,
options: {
responsive: true,
plugins: { legend: { position: 'bottom' } }
}
});
setChartInstance(newChart);
}

}, [tasks]);

return (
<div style={{ fontFamily: 'Arial', padding: '20px', maxWidth: '900px', margin: 'auto' }}>
<h2 style={{ textAlign: 'center', color: '#333', marginBottom: '20px', textShadow: '1px 1px #ddd' }}>Task Dashboard</h2>

{/* Input section */}
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
border: '1px solid #ccc',
boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
transition: '0.2s',
}}
onFocus={e => e.target.style.borderColor = '#4caf50'}
onBlur={e => e.target.style.borderColor = '#ccc'}
/>
<button
onClick={addTask}
style={{
padding: '10px 16px',
borderRadius: '8px',
border: 'none',
background: '#4caf50',
color: 'white',
cursor: 'pointer',
transition: '0.2s'
}}
onMouseOver={e => e.target.style.background = '#45a049'}
onMouseOut={e => e.target.style.background = '#4caf50'}
>
Add
</button>
</div>

{/* Dashboard content */}
<div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
{/* Task list */}
<div style={{ flex: '1 1 400px' }}>
<h3 style={{ color: '#555', marginBottom: '15px' }}>Tasks ({tasks.length})</h3>
<ul style={{ listStyle: 'none', padding: 0 }}>
{tasks.map(task => (
<li key={task.id} style={{
background: task.done ? '#e0f7e9' : '#f9f9f9',
padding: '12px 16px',
marginBottom: '10px',
borderRadius: '10px',
display: 'flex',
justifyContent: 'space-between',
alignItems: 'center',
boxShadow: '0 2px 5px rgba(0,0,0,0.08)',
cursor: 'pointer',
transform: 'translateY(0)',
transition: 'all 0.2s ease-in-out',
}}
onMouseOver={e => e.currentTarget.style.transform = 'translateY(-3px)'}
onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
>
<span
onClick={() => toggleDone(task.id)}
style={{
textDecoration: task.done ? 'line-through' : 'none',
color: task.done ? '#4caf50' : '#333',
fontWeight: '500'
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
borderRadius: '6px',
cursor: 'pointer',
fontWeight: 'bold',
transition: '0.2s'
}}
onMouseOver={e => e.target.style.background = '#d32f2f'}
onMouseOut={e => e.target.style.background = 'red'}
>
Delete
</button>
</li>
))}
</ul>
</div>

{/* Chart */}
<div style={{ flex: '0 0 300px', textAlign: 'center', marginTop: '20px' }}>
<h3 style={{ color: '#555', marginBottom: '15px' }}>Task Status</h3>
<canvas ref={chartRef}></canvas>
</div>
</div>
</div>
);
}

// Render dashboard
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Dashboard />);

































  

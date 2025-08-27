import { apiPost } from '../api';

async function handleCreateProject() {
  try {
    const newProject = await apiPost('/projects', {
      title: 'My First Project',
      description: 'Just testing',
      tags: ['test', 'first'],
    });
    console.log('✅ Project Created:', newProject);
  } catch (err) {
    console.error('❌ Error creating project:', err);
  }
}

  return (
    <div>
      <button onClick={handleCreateProject}>Create Project</button>
    </div>
  );

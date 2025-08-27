import api from './api';

export async function createProject(payload) {
  const body = {
    title: payload.title ?? payload.name,
    name: payload.name ?? payload.title,
    description: payload.description ?? '',
    nodes: payload.nodes ?? [],
    edges: payload.edges ?? [],
  };
  const res = await api.post('/projects', body);
  return res.data;
}

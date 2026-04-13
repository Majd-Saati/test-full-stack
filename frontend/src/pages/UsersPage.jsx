import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from '../api/users';

export default function UsersPage() {
  const { data, isPending, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  return (
    <section className="page">
      <div className="page-header">
        <h1>Users</h1>
        <button type="button" className="btn ghost" onClick={() => refetch()} disabled={isFetching}>
          Refresh
        </button>
      </div>
      {isPending && <p className="muted">Loading users…</p>}
      {isError && (
        <div className="alert error">
          {error.response?.data?.error || error.message || 'Could not load users'}
        </div>
      )}
      {data && (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {data.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.createdAt ? new Date(u.createdAt).toLocaleString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../api/products';

function formatPrice(value) {
  const n = Number(value);
  if (Number.isNaN(n)) return value;
  return n.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
}

export default function ProductsPage() {
  const { data, isPending, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  return (
    <section className="page">
      <div className="page-header">
        <h1>Products</h1>
        <button type="button" className="btn ghost" onClick={() => refetch()} disabled={isFetching}>
          Refresh
        </button>
      </div>
      {isPending && <p className="muted">Loading products…</p>}
      {isError && (
        <div className="alert error">
          {error.response?.data?.error || error.message || 'Could not load products'}
        </div>
      )}
      {data && (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              {data.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td className="cell-muted">{p.description || '—'}</td>
                  <td>{formatPrice(p.price)}</td>
                  <td>{p.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

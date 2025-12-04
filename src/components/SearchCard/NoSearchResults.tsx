export default function NoSearchResults({ type }: { type: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <p>No {type}s found matching your search criteria.</p>
      <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.5rem' }}>Try adjusting your filters or search terms.</p>
    </div>
  );
}

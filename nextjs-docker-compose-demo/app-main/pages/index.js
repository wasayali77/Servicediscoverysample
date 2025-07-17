export async function getServerSideProps() {
  let sidebar = '';
  let footer = '';

  try {
    const sidebarRes = await fetch('http://app-sidebar:3000/api/hello');
    const sidebarData = await sidebarRes.json();
    sidebar = sidebarData.message;
  } catch (e) {
    sidebar = 'Sidebar unavailable';
  }

  try {
    const footerRes = await fetch('http://app-footer:3000/api/hello');
    const footerData = await footerRes.json();
    footer = footerData.message;
  } catch (e) {
    footer = 'Footer unavailable';
  }

  return {
    props: { sidebar, footer },
  };
}

export default function Home({ sidebar, footer }) {
  return (
    <div>
      <h1>Main App</h1>
      <p>Sidebar says: {sidebar}</p>
      <p>Footer says: {footer}</p>
    </div>
  );
}

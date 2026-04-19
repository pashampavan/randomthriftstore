import Layout from '../components/Layout';
import useSiteData from '../hooks/useSiteData';

function BlogsPage() {
  const { siteData } = useSiteData();
  const blogs = siteData?.sections?.blogs || [];

  return (
    <Layout menu={siteData.menu} categories={siteData?.sections?.categories}>
      <section className="section">
        <h1>Fashion Blog</h1>
        <p>Tips, care guides, and sustainable style stories from the Rewago team.</p>
        <div className="blog-grid">
          {blogs.map((blog) => (
            <article key={blog.id || blog.title} className="blog-card">
              <img src={blog.imageUrl} alt={blog.title} />
              <h3>{blog.title}</h3>
              <p>{blog.excerpt}</p>
              <small>By {blog.author || 'Rewago Team'}</small>
            </article>
          ))}
        </div>
      </section>
    </Layout>
  );
}

export default BlogsPage;

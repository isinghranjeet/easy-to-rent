import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, Eye, Heart, ArrowLeft, Share2, User } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { api } from '@/services/api';
import { toast } from 'sonner';

interface Blog {
  _id: string;
  title: string;
  content: string;
  coverImage: string;
  category: string;
  author: string;
  authorImage: string;
  readTime: number;
  views: number;
  likes: number;
  publishedAt: string;
  tags: string[];
}

interface RelatedBlog {
  _id: string;
  title: string;
  slug: string;
  coverImage: string;
  publishedAt: string;
}

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<RelatedBlog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlog();
  }, [slug]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await api.request(`/api/blogs/${slug}`);
      if (response.success) {
        setBlog(response.data.blog);
        setRelatedBlogs(response.data.relatedBlogs);
      }
    } catch (error) {
      toast.error('Blog not found');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!blog) return;
    try {
      const response = await api.request(`/api/blogs/${blog._id}/like`, { method: 'POST' });
      if (response.success) {
        setBlog({ ...blog, likes: response.data.likes });
        toast.success('Thanks for liking!');
      }
    } catch (error) {
      toast.error('Failed to like');
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold">Blog not found</h1>
          <Link to="/blog" className="text-orange-500 mt-4 inline-block">Back to Blog</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <article className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back button */}
        <Link to="/blog" className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-500 mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>

        {/* Cover Image */}
        <div className="rounded-2xl overflow-hidden mb-8">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-64 md:h-96 object-cover"
          />
        </div>

        {/* Title & Meta */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{blog.title}</h1>
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8 pb-4 border-b">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
              <User className="h-4 w-4 text-orange-600" />
            </div>
            <span>{blog.author}</span>
          </div>
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {formatDate(blog.publishedAt)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {blog.readTime} min read
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {blog.views} views
          </span>
        </div>

        {/* Content */}
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {blog.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 pt-6 border-t flex items-center justify-between flex-wrap gap-4">
          <button
            onClick={handleLike}
            className="flex items-center gap-2 px-4 py-2 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100 transition"
          >
            <Heart className="h-4 w-4" />
            Like ({blog.likes})
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success('Link copied!');
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition"
          >
            <Share2 className="h-4 w-4" />
            Share
          </button>
        </div>

        {/* Related Blogs */}
        {relatedBlogs.length > 0 && (
          <div className="mt-12">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedBlogs.map((related) => (
                <Link
                  key={related._id}
                  to={`/blog/${related.slug}`}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition group"
                >
                  <img
                    src={related.coverImage}
                    alt={related.title}
                    className="w-full h-32 object-cover group-hover:scale-105 transition"
                  />
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-orange-500">
                      {related.title}
                    </h4>
                    <p className="text-xs text-gray-400 mt-2">{formatDate(related.publishedAt)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

      <Footer />
    </div>
  );
};

export default BlogDetail;
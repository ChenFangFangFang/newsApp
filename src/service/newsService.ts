'use client';
import React, { useState } from 'react';
interface Article {
    title: string;
    description: string;
    url: string;
    urlToImage?: string;
    publishedAt: string;
    source: { name: string };
  }
const NewsService = ()=>{
    const [news, setNews] = useState<{ articles: Article[] } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchNews = async () => {  
        try {
          const res = await fetch('/api/news?category=business');
          if (!res.ok) throw new Error('Network error');
          const data = await res.json();
          setNews(data);
        } catch {
          setError('Error fetching news');
        } finally {
          setLoading(false);
        }
      };

      fetchNews()
}
export default NewsService
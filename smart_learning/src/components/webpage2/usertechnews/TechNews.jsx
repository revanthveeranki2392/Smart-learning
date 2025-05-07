import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TechNews.css';
import { Card, Button, Row, Col, Container } from 'react-bootstrap';

const TechNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(9); // Number of visible articles

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(
          `https://newsapi.org/v2/everything?q=technology OR "artificial intelligence" OR "cloud computing" OR "job trends" OR "salary increase" OR "programming" AND (job OR careers OR employment)&sortBy=popularity&language=en&apiKey=faf681c3f88d494192adcbb5000056ea`
        );
        // Filter out articles without an image
        const filteredArticles = response.data.articles.filter(article => article.urlToImage);
        setNews(filteredArticles);
        setLoading(false);
      } catch (err) {
        setError('Error fetching news');
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleShowMore = () => {
    setVisibleCount((prevCount) => prevCount + 6); // Show 6 more articles
  };

  if (loading) return <p>Loading news...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Container>
      <h2 className="mt-4 mb-4 text-center">Latest Innovations and Job Trends in Technology</h2>
      <Row xs={1} md={2} lg={3} className="g-4">
        {news.slice(0, visibleCount).map((article, index) => (
          <Col key={index}>
            <Card className="h-100">
              <Card.Img
                variant="top"
                src={article.urlToImage}
                alt="News Thumbnail"
              />
              <Card.Body>
                <Card.Title>{article.title}</Card.Title>
                <Card.Text>{article.description}</Card.Text>
              </Card.Body>
              <Card.Footer>
                <small className="text-muted">Source: {article.source.name}</small> <br />
                <small className="text-muted">Published: {new Date(article.publishedAt).toLocaleDateString()}</small>
                <Button
                  variant="primary"
                  className="mt-2"
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read More
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
      {visibleCount < news.length && (
        <div className="text-center mt-4">
          <Button variant="secondary" onClick={handleShowMore}>
            Show More
          </Button>
        </div>
      )}
    </Container>
  );
};

export default TechNews;

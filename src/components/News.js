import React, { useEffect, useState } from 'react'

import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {
  const [articles, setArticles] = useState([])                        // filhaal articles array hai ni => api se aaega
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)

  // In class-based component:
  // constructor(){
  //   super();
  //   this.state = {
  //     articles: this.articles,
  //     loading: false
  //   }
  // }

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const updateNews = async () => {
    props.setProgress(10);
    // Math.ceil(this.state.totalResults/props.pageSize)   => total no. of pages
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
    setLoading(true)                   // so that spinner icon (loading) shows up
    let data = await fetch(url);          // to fetch url
    props.setProgress(30);
    let parsedData = await data.json()      // converting it to json
    props.setProgress(70);
    setArticles(parsedData.articles)
    setTotalResults(parsedData.totalResults)
    setLoading(false)
    props.setProgress(100);

    // In class-based Components:
    // this.setState({
    //   articles: parsedData.articles,
    //   totalResults: parsedData.totalResults,
    //   loading: false
    // })
  }

  // This is a life cycle method which runs after render()
  // In class-based component
  // async componentDidMount() {
  //   this.updateNews();
  // }

  // In function-based component in place of componentDidMount:
  useEffect(() => {
    document.title = `${capitalizeFirstLetter(props.category)} - News360`;
    updateNews();
    // eslint-disable-next-line  
  }, [])              // jiske change pe ye effect run ho, us input ko listen krte hai => abhi ke liye empty rkh diya hai

  // this above comment: "eslint-disable-next-line" has been added to remove this warning:
  // React Hook useEffect has a missing dependency: 'updateNews'. Either include it or remove the dependency array

  // handleNextClick = async () => {
  //   this.setState({
  //     page: this.state.page + 1
  //   })
  //   this.updateNews();
  // }

  // handlePreviousClick = async () => {
  //   this.setState({
  //     page: this.state.page - 1
  //   })
  //   this.updateNews();
  // }

  const fetchMoreData = async () => {
    // this.setState({ page: this.state.page + 1 });           // in class-based
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page + 1}&pageSize=${props.pageSize}`;
    setPage(page + 1)
    let data = await fetch(url);
    let parsedData = await data.json()
    setArticles(articles.concat(parsedData.articles))
    setTotalResults(parsedData.totalResults)
  };

  return (
    <>
      <h1 className="text-center" style={{ margin: '90px 0px 0px' }}>News360 - Top {capitalizeFirstLetter(props.category)} Headlines</h1>
      {loading && <Spinner />}
      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={articles.length !== totalResults}
        loader={<Spinner />}
      >
        <div className="container">

          <div className="row">
            {articles.map((element) => {
              return <div className="col-md-4" key={element.url}>
                <NewsItem title={element.title ? element.title : "Click on Read More below"} description={element.description ? element.description : "Click on Read More below"} imageUrl={element.urlToImage} newsUrl={element.url} author={!element.author ? "Unknown" : element.author} date={element.publishedAt} source={element.source.name} />
              </div>
            })}
          </div>
        </div>
      </InfiniteScroll>

    </>
  )

}


News.defaultProps = {
  country: 'in',
  pageSize: 8,
  category: 'general',
}

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
}

export default News

// My api keys:

// ad7fcc7b88dc47ebb2e740109f58d19c        - ankieekhera@gmail.com
// 859e006d999541f8b8ac770caa92a169        - ankushkhera09@gmail.com
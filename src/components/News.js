import React, { Component } from 'react';
import NewsItem from './NewsItem';
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';

export default class News extends Component {

  static defaultProps = {
    pageSize: "6",
    country: "in",
    category: "general"
  }

  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
  }

  capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  constructor(props) {
    super(props);
    this.state = {
      articles: [],      // filhaal articles array hai ni => api se aaega
      loading: true,
      page: 1,
      totalResults: 0
    }

    document.title = `NewsMonkey - ${this.capitalizeFirstLetter(this.props.category)}`
  }

  // This is a life cycle method which runs after render()
  async componentDidMount() {
    this.updateNews();
  }

  async updateNews() {
    this.props.setProgress(10);
    // Math.ceil(this.state.totalResults/this.props.pageSize)   => total no. of pages
    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apikey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`
    this.setState({ loading: true });         // so that spinner icon (loading) shows up
    let data = await fetch(url);              // to fetch url
    this.props.setProgress(30);
    let parsedData = await data.json();        // converting it to json
    this.props.setProgress(50);
    this.setState({
      articles: parsedData.articles,
      totalResults: parsedData.totalResults,
      loading: false
    })
    this.props.setProgress(100);
  }

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

  fetchMoreData = async () => {
    this.setState({ page: this.state.page + 1 });
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apikey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`
    let data = await fetch(url);              // to fetch url
    let parsedData = await data.json();        // converting it to json

    this.setState({
      articles: this.state.articles.concat(parsedData.articles),
      totalResults: parsedData.totalResults,
      loading: false
    })
  }

  render() {
    return (
      <>
        <h2 className="text-center" style={{ margin: "35px 0px" }}>NewsMonkey - Top {this.capitalizeFirstLetter(this.props.category)} Headlines</h2>
        {this.state.loading && <Spinner />}
        <InfiniteScroll dataLength={this.state.articles.length} next={this.fetchMoreData} hasMore={this.state.articles.length !== this.state.totalResults} loader={<Spinner />}>
          <div className="container">
            <div className="row">
              {this.state.articles.map((element) => {
                return <div className="col-md-4" key={element.url}> <NewsItem title={element.title ? element.title.slice(0, 60) : "Click on Read More below"} description={element.description ? element.description.slice(0, 88) : "Click on Read More below"} imageUrl={element.urlToImage} newsUrl={element.url} author={!element.author ? "Unknown" : element.author} date={element.publishedAt} source={element.source.name} /> </div>
              })}
            </div>
          </div>
        </InfiniteScroll>
        {/* <div className="container d-flex justify-content-between">
          <button type="button" className="btn btn-dark" onClick={this.handlePreviousClick} disabled={this.state.page <= 1}>&larr; Previous</button>
          <button type="button" className="btn btn-dark" onClick={this.handleNextClick} disabled={this.state.page + 1 > Math.ceil(this.state.totalResults / this.props.pageSize)}>Next &rarr;</button>
        </div> */}
      </>
    );
  }
}




// My api keys:

// ad7fcc7b88dc47ebb2e740109f58d19c        - ankieekhera@gmail.com
// 859e006d999541f8b8ac770caa92a169        - ankushkhera09@gmail.com
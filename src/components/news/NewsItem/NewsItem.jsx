'use struct';
import React, {Component} from 'react';
import compose from 'recompose/compose';
import withWidth from '@material-ui/core/withWidth';
import {withRouter} from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import './style.less';

class NewsItem extends Component {

  showNewsDetails = () => {
    const {news, history, location} = this.props;

    history.push({
      pathname: location.pathname + '/news/' + news.id,
      state: {
        to: 'modal',
        data: news,
      }
    });
  };

  render() {
    const {news, width} = this.props;
    return (
      <div className='news-item-container'>
        <Card className='news-item-card'>
          <CardActionArea onClick={this.showNewsDetails}>
            <CardMedia
              component={'div'}
              style={{paddingTop: '70%'}}
              image={__API__ + '/news/' + news.id + '/pictures/' + width.toUpperCase()}
              title={news.title}
            />
            <CardContent>
              <Typography gutterBottom variant='h5'>
                {news.title}
              </Typography>
              <Typography>
                {news.teaser}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button color='primary' onClick={this.showNewsDetails}>
              mehr
            </Button>
          </CardActions>
        </Card>
      </div>
    );
  }
}

export default compose(
  withWidth(),
  withRouter,
)(NewsItem);
'use struct';
import React, {Component} from 'react';
import compose from 'recompose/compose';
import {withRouter} from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import moment from 'moment';
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
    const {id, title, teaser, validity} = this.props.news;
    const date = moment(validity.from).format("DD.MM.YYYY");
    return (
      <div className='news-item-container'>
        <Card className='news-item-card'>
          <CardActionArea onClick={this.showNewsDetails}>
            <CardHeader
              title={title}
              subheader={date}>
            </CardHeader>
            <CardMedia
              component={'div'}
              style={{paddingTop: '70%'}}
              image={__API__ + '/news/' + id + '/pictures/XS'}
              title={title}
            />
            <CardContent>
              <Typography>
                {teaser}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions style={{justifyContent: 'flex-end'}}>
            <Button color='primary' onClick={this.showNewsDetails}>
              lese hier mehr dazu
            </Button>
          </CardActions>
        </Card>
      </div>
    );
  }
}

export default compose(
  withRouter,
)(NewsItem);

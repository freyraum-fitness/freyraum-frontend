'use struct';
import React, {Component} from 'react';
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import './style.less';

class NewsItem extends Component {

  render() {
    const {news} = this.props;
    return (
      <div className='news-item-container'>
        <Card className='news-item-card'>
          <CardActionArea>
            <CardMedia
              component={'div'}
              style={{paddingTop: '70%'}}
              image={__API__ + '/test' + news.pictureId + '.jpg'}
              title={news.title}
            />
            <CardContent>
              <Typography gutterBottom variant="h5">
                {news.title}
              </Typography>
              <Typography>
                {news.teaser}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button color='primary'>
              mehr
            </Button>
          </CardActions>
        </Card>
      </div>
    );
  }
}

export default NewsItem;
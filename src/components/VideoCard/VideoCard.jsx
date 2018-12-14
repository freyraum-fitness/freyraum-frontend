'use strict';
import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import ReactPlayer from 'react-player';
import './style.less';

class VideoCard extends React.Component {

  render() {
    const {title, url} = this.props;
    return (
      <div className='video-card-container'>
        <Card>
          <CardMedia src='iframe'>
            <ReactPlayer
              url={url}
              config={{
                youtube: {
                  playerVars: {
                    rel: 0,
                  }
                }
              }}
              playsinline
              width='100%'
              height='200px'/>
          </CardMedia>
          <CardContent>
            <Typography>
              {title}
            </Typography>
          </CardContent>
        </Card>
      </div>
    );
  }
}

export default VideoCard;
'use strict';
import React, {Component} from 'react';
import compose from 'recompose/compose';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import withWidth from '@material-ui/core/withWidth';
import {withRouter} from 'react-router-dom';
import moment from 'moment/moment';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ArrowBack from '@material-ui/icons/ArrowBack';
import Edit from '@material-ui/icons/Edit';
import IconCamera from '@material-ui/icons/CameraAlt';
import {viewPath} from './../../utils/RamdaUtils';
import {DATE_FORMAT} from './../../utils/Format';
import {changeDetails, getNews, initNewNews, MODE, resetDetails, saveDetails, uploadPicture} from './../../model/news';
import './style.less';
import LoadingIndicator from '../../components/LoadingIndicator';
import WithDialog, {WithDateTimeDialog} from '../../components/WithDialog';
import ImageSelector from '../../components/ImageSelector';
import {OnlyIf, SignedIn} from '../../components/Auth';
import {deepEqual, setPath} from '../../utils/RamdaUtils';
import CKEditor from '@ckeditor/ckeditor5-react';
import InlineEditor from '@ckeditor/ckeditor5-build-inline';

const infinity = '\u221E';

class NewsDetails extends Component {

  state = {
    mode: null,
    showPictureDialog: false,
  };

  constructor(props) {
    super(props);
    const {match, actions} = props;
    const id = match.params.id;
    if ('new' === id) {
      this.state.mode = MODE.CREATE;
      actions.initNewNews();
    } else {
      this.state.mode = MODE.VIEW;
      actions.getNews(id);
    }
  }

  toggleMode = () => {
    if (this.state.mode === MODE.VIEW) {
      this.setState(setPath(['mode'], MODE.MODIFY, this.state));
    } else if (this.state.mode === MODE.MODIFY) {
      this.setState(setPath(['mode'], MODE.VIEW, this.state));
    }
  };

  getNewsDetails = () => {
    if (this.state.mode === MODE.VIEW && viewPath('news', 'details', 'pending', this.props)) {
      return viewPath(['location', 'state', 'data'], this.props);
    }
    return viewPath(['news', 'details', 'data'], this.props);
  };

  hasChanges = () => !viewPath(['news', 'details', 'pending'], this.props)
    && !deepEqual(
      viewPath(['news', 'details', 'originalData'], this.props),
      viewPath(['news', 'details', 'data'], this.props));

  discardChanges = () => {
    this.props.actions.resetNewsDetails();
    if (this.state.mode === MODE.CREATE) {
      this.goBack();
    }
  };

  goBack = () => {
    this.props.history.goBack();
  };

  handleRequestSave = () => {
    this.props.actions.saveDetails(viewPath(['news', 'details', 'data'], this.props));
  };

  openPictureDialog = () => {
    this.setState(setPath(['showPictureDialog'], true, this.state));
  };

  closePictureDialog = () => {
    this.setState(setPath(['showPictureDialog'], false, this.state));
  };

  getText(editable, news, actions) {
    console.warn("get", news, news.text);
    return <CKEditor
      key={news.id}
      editor={InlineEditor}
      disabled={!editable}
      data={news.text}
      onChange={ (event, editor) => {
        const data = editor.getData();
        actions.changeDetails(['text'], data);
      } }
    />;
  }

  getTeaser(editable, news, actions) {
    return <OnlyIf isTrue={editable}>
      <SignedIn hasAnyRole={['TRAINER', 'ADMIN']}>
        <div style={{paddingBottom: '16px'}}>
          <Divider light/>
          <Typography variant='caption'>
            (Teaser)
          </Typography>
          <WithDialog editable={editable} label='Teaser' value={news.teaser}
                      onChange={value => actions.changeDetails(['teaser'], value)}>
            <Typography gutterBottom>
              {news.teaser}
            </Typography>
          </WithDialog>
          <Divider light/>
        </div>
      </SignedIn>
    </OnlyIf>;
  }

  getTitle(editable, news, actions) {
    return <WithDialog editable={editable} label='Titel' value={news.title}
                       onChange={value => actions.changeDetails(['title'], value)}>
      <Typography variant='h4' gutterBottom>
        {news.title}
      </Typography>
    </WithDialog>;
  }

  getValidity(editable, news, actions) {
    return <Grid container>
      <OnlyIf isTrue={editable}>
        <Grid item xs={12}>
          <Typography variant='caption'>
            (Anzeigedauer)
          </Typography>
        </Grid>
      </OnlyIf>
      <Grid item>
        <WithDateTimeDialog editable={editable} value={news.validity.from}
                            onChange={value => actions.changeDetails(['validity', 'from'], value)}>
          <Typography variant='caption'>
            {moment(news.validity.from).format(DATE_FORMAT)}
          </Typography>
        </WithDateTimeDialog>
      </Grid>

      <OnlyIf isTrue={editable}>
        <SignedIn hasAnyRole={['TRAINER', 'ADMIN']}>
          <Grid item>
            <WithDateTimeDialog editable={editable} value={news.validity.to}
                                onChange={value => actions.changeDetails(['validity', 'to'], value)}>
              <Typography variant='caption'>
                {' - ' + (news.validity.to ? moment(news.validity.to).format(DATE_FORMAT) : infinity)}
              </Typography>
            </WithDateTimeDialog>
          </Grid>
        </SignedIn>
      </OnlyIf>
    </Grid>;
  }

  getNewsImage(news, width, actions) {

    let size = 'MD';
    if (width === 'sm') {
      size = 'SM';
    } else if (width === 'xs') {
      size = 'XS';
    }

    return <Grid item xs={12} sm={10} md={8} className='news-details-picture'>
      <img
        width='100%'
        alt=''
        src={__API__ + '/news/' + news.id + '/pictures/' + size}/>

      <OnlyIf isTrue={!!news.id}>
        <SignedIn hasAnyRole={['TRAINER', 'ADMIN']}>
          <div className='news-details-choose-picture-icon'>
            <Button
              variant='fab'
              color='secondary'
              aria-label='edit'
              onClick={this.openPictureDialog}>
              <IconCamera/>
            </Button>
            <ImageSelector
              ratio={16/9}
              pending={this.props.news.uploadPicture.pending}
              error={this.props.news.uploadPicture.error}
              open={this.state.showPictureDialog}
              onClose={this.closePictureDialog}
              onSave={formData => actions.uploadPicture(news.id, formData, this.closePictureDialog)}
            />
          </div>
        </SignedIn>
      </OnlyIf>
      <OnlyIf isTrue={!news.id}>
        <Typography align='center'>
          Ein Bild kannst du nach dem Speichern hinzufügen
        </Typography>
      </OnlyIf>
    </Grid>;
  }

  getAcceptChangesControls(hasChanges, mode) {
    return <SignedIn hasAnyRole={['TRAINER', 'ADMIN']}>
      <Grid item xs={12} sm={10} md={8} className='news-details-accept-changes'>
        <div
          style={{
            display: 'flex',
            height: '0px',
            padding: '0px',
            overflow: 'hidden',
            justifyContent: 'center',
          }}
          className={hasChanges ? 'news-details-have-changes' : undefined}>
          <Button color='secondary' onClick={this.discardChanges}>
            {mode === MODE.CREATE ? 'Abbrechen' : 'Änderungen verwerfen'}
          </Button>
          <Button color='primary' onClick={this.handleRequestSave}>
            {mode === MODE.CREATE ? 'Neuigkeiten speichern' : 'Änderungen speichern'}
          </Button>
        </div>
      </Grid>
    </SignedIn>;
  }

  getAppBar(editable, news, mode) {
    return <AppBar className='page-app-bar' position='sticky'>
      <Toolbar>
        <IconButton className='back-button' color='inherit' onClick={this.props.history.goBack}>
          <ArrowBack/>
        </IconButton>
        <Typography variant='h6' color='inherit' style={{flex: 1}}>
          {news.title}
        </Typography>
        {
          mode !== MODE.CREATE
            ? <SignedIn hasAnyRole={['TRAINER', 'ADMIN']}>
              <IconButton color='inherit' onClick={this.toggleMode} style={editable ? {transform: 'rotateY(180deg)'} : undefined}>
                <Edit/>
              </IconButton>
            </SignedIn>
            : undefined
        }
      </Toolbar>
    </AppBar>;
  }

  render() {
    const news = this.getNewsDetails();
    if (!news || news.id === '') {
      return <LoadingIndicator/>;
    }
    const {actions, width} = this.props;
    const {mode} = this.state;
    const hasChanges = this.hasChanges();
    const editable = !mode.readonly;

    return (
      <div className='news-details'>
        {this.getAppBar(editable, news, mode)}

        <Grid container spacing={16} justify='center' style={{width: '100%', margin: '0px'}}>
          {this.getNewsImage(news, width, actions)}
          {this.getAcceptChangesControls(hasChanges, mode)}

          <Grid item xs={12} sm={10} md={8} className='news-details-textarea'>
            {this.getValidity(editable, news, actions)}
            {this.getTitle(editable, news, actions)}
            {this.getTeaser(editable, news, actions)}
            {this.getText(editable, news, actions)}
          </Grid>
        </Grid>
      </div>
    );
  };
}

const mapStateToProps = state => ({
  news: state.news
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    initNewNews: initNewNews,
    getNews: getNews,
    changeDetails: changeDetails,
    resetNewsDetails: resetDetails,
    saveDetails: saveDetails,
    uploadPicture: uploadPicture,
  }, dispatch),
  dispatch
});

export default compose(
  withRouter,
  withWidth(),
  connect(mapStateToProps, mapDispatchToProps)
)(NewsDetails);

import { ImageGalleryList } from '../ImageGallery';
import { Searchbar } from '../Searchbar';

import React, { Component } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { api } from '../../services/api';

import s from './TaskImageFinder.module.css';
import Button from 'components/Button/Button';

const Status = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

export class TaskImageFinder extends Component {
  state = {
    search: '',
    page: 1,
    images: [],
    error: null,
    status: Status.IDLE,
  };

  handleFormSubmit = search => {
    this.setState({ search, images: [], page: 1 });
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.page !== this.state.page) {
      api.fetchImages(this.state.search, this.state.page).then(({ data }) => {
        this.setState(prevState => ({
          images: [...prevState.images, ...data.hits],
        }));
      });
    }

    if (prevState.search !== this.state.search) {
      api.fetchImages(this.state.search, this.state.page).then(({ data }) => {
        this.setState({ images: data.hits });
      });
    }
  }

  handleLoadMoreClick = () => {
    this.setState(prevState => ({ page: prevState.page + 1 }));
  };

  render() {
    return (
      <div className={s.box}>
        <Searchbar onSubmit={this.handleFormSubmit} />
        {this.state.images && <ImageGalleryList images={this.state.images} />}

        <Button onClick={this.handleLoadMoreClick} />

        <button
          type="button"
          onClick={() => {
            toast.error('Wow so easy!');
          }}
        >
          Go Message
        </button>
        <ToastContainer theme="dark" />
      </div>
    );
  }
}

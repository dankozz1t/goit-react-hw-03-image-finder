import React, { Component } from 'react';

import { api } from '../../services/api';

import { Searchbar } from '../Searchbar';
import { Loader } from '../Loader';
import { ImageGalleryList } from '../ImageGallery';
import { Button } from '../Button';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import s from './TaskImageFinder.module.css';

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
    totalPage: null,
    images: [],
    error: null,
    status: Status.IDLE,
  };

  handleFormSubmit = search => {
    this.setState({ search, images: [], page: 1 });
  };

  componentDidUpdate(prevProps, prevState) {
    const { page, search } = this.state;

    if (prevState.search !== search || prevState.page !== page) {
      this.setState({ status: Status.PENDING });

      api
        .fetchImages(search, page)
        .then(({ data }) => {
          if (prevState.search !== search) {
            if (data.hits <= 0) {
              toast.info(`Wtf, Idn what "${search}" is`);
              this.setState({
                error: 'not found',
                status: Status.REJECTED,
              });
              return;
            }

            this.setState({
              images: data.hits,
              totalPage: data.total,
              status: Status.RESOLVED,
            });
          }

          if (prevState.page !== page) {
            this.setState(prevState => ({
              images: [...prevState.images, ...data.hits],
              totalPage: data.total,
              status: Status.RESOLVED,
            }));
          }
        })
        .catch(error =>
          this.setState({ error: error.message, status: Status.REJECTED })
        );
    }
  }

  handleLoadMoreClick = () => {
    this.setState(prevState => ({ page: prevState.page + 1 }));
  };

  render() {
    const { page, totalPage, images, status, error } = this.state;

    const isShowButton = page <= totalPage ? true : false;

    return (
      <div className={s.box}>
        <Searchbar onSubmit={this.handleFormSubmit} />

        {status === 'pending' && (
          <>
            {images.length > 0 && <ImageGalleryList images={images} />}
            <Loader />
          </>
        )}

        {status === 'resolved' && (
          <>
            {images.length > 0 && <ImageGalleryList images={images} />}
            {isShowButton && <Button onClick={this.handleLoadMoreClick} />}
          </>
        )}

        {status === 'rejected' && (
          <>
            <img
              src="https://i.ibb.co/ss9ZJ7L/not-found.jpg"
              alt="not found images"
            />
            <p className={s.error}>
              Error message: <span className={s.errorMessage}>{error}</span>
            </p>
          </>
        )}

        <ToastContainer theme="dark" />
      </div>
    );
  }
}

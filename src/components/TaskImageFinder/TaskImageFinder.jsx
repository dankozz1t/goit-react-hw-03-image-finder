import { ImageGalleryList } from '../ImageGallery';
import { Searchbar } from '../Searchbar';

import React, { Component } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { api } from '../../services/api';

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
    images: null,
    error: null,
    status: Status.IDLE,
  };

  handleFormSubmit = search => {
    api.fetchImages(search, '1').then(({ data }) => {
      this.setState({ search, images: data.hits });
      console.log(data.hits);
    });
  };

  render() {
    return (
      <div className={s.box}>
        <Searchbar onSubmit={this.handleFormSubmit} />
        {this.state.images && <ImageGalleryList images={this.state.images} />}

        <button
          type="button"
          onClick={() => {
            toast.error('Wow so easy!');
          }}
        >
          Go Message
        </button>
        <ToastContainer />
      </div>
    );
  }
}

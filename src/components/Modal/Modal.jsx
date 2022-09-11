import React, { Component } from 'react';
import PropTypes from 'prop-types';

import s from './Modal.module.css';

export default class Modal extends Component {
  static propTypes = {
    onCloseModal: PropTypes.func.isRequired,
    src: PropTypes.string.isRequired,
  };

  handleCloseModal = e => {
    if (e.target === e.currentTarget) {
      this.props.onCloseModal();
    }
  };

  render() {
    return (
      <div className={s.Overlay} onClick={this.handleCloseModal}>
        <div className={s.Modal}>
          <img src={this.props.src} alt="" />
        </div>
      </div>
    );
  }
}

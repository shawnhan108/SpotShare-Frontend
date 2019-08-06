import React, { Component, Fragment } from 'react';

import Backdrop from '../../Backdrop/Backdrop';
import Modal from '../../Modal/Modal';
import Input from '../../Form/Input/Input';
import FilePicker from '../../Form/Input/FilePicker';
import Image from '../../Image/Image';
import { required, length } from '../../../util/validators';
import { generateBase64FromImage } from '../../../util/image';

const POST_FORM = {
  title: {
    value: '',
    valid: false,
    touched: false,
    validators: [required, length({ min: 5 })]
  },
  image: {
    value: '',
    valid: false,
    touched: false,
    validators: [required]
  },
  content: {
    value: '',
    valid: false,
    touched: false,
    validators: [required, length({ min: 5 })]
  },
  taken_date: {
    value: '',
    valid: false,
    touched: false,
    validators: [required]
  },
  location: {
    value: '',
    valid: false,
    touched: false,
    validators: [required]
  },
  ISO: {
    value: '',
    valid: false,
    touched: false,
    validators: [required]
  },
  shutter_speed: {
    value: '',
    valid: false,
    touched: false,
    validators: [required]
  },
  aperture: {
    value: '',
    valid: false,
    touched: false,
    validators: [required]
  },
  camera: {
    value: '',
    valid: false,
    touched: false,
    validators: [required]
  },
  lens: {
    value: '',
    valid: false,
    touched: false,
    validators: [required]
  },
  equipment: {
    value: '',
    valid: false,
    touched: false,
    validators: [required]
  },
  edit_soft: {
    value: '',
    valid: false,
    touched: false,
    validators: [required]
  }
};

class FeedEdit extends Component {
  state = {
    postForm: POST_FORM,
    formIsValid: false,
    imagePreview: null
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.editing &&
      prevProps.editing !== this.props.editing &&
      prevProps.selectedPost !== this.props.selectedPost
    ) {
      const postForm = {
        title: {
          ...prevState.postForm.title,
          value: this.props.selectedPost.title,
          valid: true
        },
        image: {
          ...prevState.postForm.image,
          value: this.props.selectedPost.imagePath,
          valid: true
        },
        content: {
          ...prevState.postForm.content,
          value: this.props.selectedPost.content,
          valid: true
        },
        taken_date: {
          ...prevState.postForm.taken_date,
          value: this.props.selectedPost.taken_date,
          valid: true
        },
        location: {
          ...prevState.postForm.location,
          value: this.props.selectedPost.location,
          valid: true
        },
        ISO: {
          ...prevState.postForm.ISO,
          value: this.props.selectedPost.ISO,
          valid: true
        },
        shutter_speed: {
          ...prevState.postForm.shutter_speed,
          value: this.props.selectedPost.shutter_speed,
          valid: true
        },
        aperture: {
          ...prevState.postForm.aperture,
          value: this.props.selectedPost.aperture,
          valid: true
        },
        camera: {
          ...prevState.postForm.camera,
          value: this.props.selectedPost.camera,
          valid: true
        },
        lens: {
          ...prevState.postForm.lens,
          value: this.props.selectedPost.lens,
          valid: true
        },
        equipment: {
          ...prevState.postForm.equipment,
          value: this.props.selectedPost.equipment,
          valid: true
        },
        edit_soft: {
          ...prevState.postForm.edit_soft,
          value: this.props.selectedPost.edit_soft,
          valid: true
        }
      };
      this.setState({ postForm: postForm, formIsValid: true });
    }
  }

  postInputChangeHandler = (input, value, files) => {
    if (files) {
      generateBase64FromImage(files[0])
        .then(b64 => {
          this.setState({ imagePreview: b64 });
        })
        .catch(e => {
          this.setState({ imagePreview: null });
        });
    }
    this.setState(prevState => {
      let isValid = true;
      for (const validator of prevState.postForm[input].validators) {
        isValid = isValid && validator(value);
      }
      const updatedForm = {
        ...prevState.postForm,
        [input]: {
          ...prevState.postForm[input],
          valid: isValid,
          value: files ? files[0] : value
        }
      };
      let formIsValid = true;
      for (const inputName in updatedForm) {
        formIsValid = formIsValid && updatedForm[inputName].valid;
      }
      return {
        postForm: updatedForm,
        formIsValid: formIsValid
      };
    });
  };

  inputBlurHandler = input => {
    this.setState(prevState => {
      return {
        postForm: {
          ...prevState.postForm,
          [input]: {
            ...prevState.postForm[input],
            touched: true
          }
        }
      };
    });
  };

  cancelPostChangeHandler = () => {
    this.setState({
      postForm: POST_FORM,
      formIsValid: false
    });
    this.props.onCancelEdit();
  };

  acceptPostChangeHandler = () => {
    const post = {
      title: this.state.postForm.title.value,
      image: this.state.postForm.image.value,
      content: this.state.postForm.content.value,
      taken_date: this.state.postForm.taken_date.value,
      location: this.state.postForm.location.value,
      ISO: this.state.postForm.ISO.value,
      shutter_speed: this.state.postForm.shutter_speed.value,
      aperture: this.state.postForm.aperture.value,
      camera: this.state.postForm.camera.value,
      lens: this.state.postForm.lens.value,
      equipment: this.state.postForm.equipment.value,
      edit_soft: this.state.postForm.edit_soft.value
    };
    this.props.onFinishEdit(post);
    this.setState({
      postForm: POST_FORM,
      formIsValid: false,
      imagePreview: null
    });
  };

  render() {
    return this.props.editing ? (
      <Fragment>
        <Backdrop onClick={this.cancelPostChangeHandler} />
        <Modal
          title="New Post"
          acceptEnabled={this.state.formIsValid}
          onCancelModal={this.cancelPostChangeHandler}
          onAcceptModal={this.acceptPostChangeHandler}
          isLoading={this.props.loading}
        >
          <form>
            <Input
              id="title"
              label="Title"
              control="input"
              onChange={this.postInputChangeHandler}
              onBlur={this.inputBlurHandler.bind(this, 'title')}
              valid={this.state.postForm['title'].valid}
              touched={this.state.postForm['title'].touched}
              value={this.state.postForm['title'].value}
            />
            <FilePicker
              id="image"
              label="Image"
              control="input"
              onChange={this.postInputChangeHandler}
              onBlur={this.inputBlurHandler.bind(this, 'image')}
              valid={this.state.postForm['image'].valid}
              touched={this.state.postForm['image'].touched}
            />
            <div className="new-post__preview-image">
              {!this.state.imagePreview && <p>Please choose an image.</p>}
              {this.state.imagePreview && (
                <Image imageUrl={this.state.imagePreview} contain left />
              )}
            </div>
            <Input
              id="content"
              label="Content"
              control="textarea"
              rows="5"
              onChange={this.postInputChangeHandler}
              onBlur={this.inputBlurHandler.bind(this, 'content')}
              valid={this.state.postForm['content'].valid}
              touched={this.state.postForm['content'].touched}
              value={this.state.postForm['content'].value}
            />
            <div>
              <Input
                id="taken_date"
                label="taken_date"
                control="input"
                onChange={this.postInputChangeHandler}
                onBlur={this.inputBlurHandler.bind(this, 'taken_date')}
                valid={this.state.postForm['taken_date'].valid}
                touched={this.state.postForm['taken_date'].touched}
                value={this.state.postForm['taken_date'].value}
              />
              <Input
                id="location"
                label="location"
                control="input"
                onChange={this.postInputChangeHandler}
                onBlur={this.inputBlurHandler.bind(this, 'location')}
                valid={this.state.postForm['location'].valid}
                touched={this.state.postForm['location'].touched}
                value={this.state.postForm['location'].value}
              />
            </div>
            <div>
              <Input
                id="ISO"
                label="ISO"
                control="input"
                onChange={this.postInputChangeHandler}
                onBlur={this.inputBlurHandler.bind(this, 'ISO')}
                valid={this.state.postForm['ISO'].valid}
                touched={this.state.postForm['ISO'].touched}
                value={this.state.postForm['ISO'].value}
              />
              <Input
                id="shutter_speed"
                label="shutter_speed"
                control="input"
                onChange={this.postInputChangeHandler}
                onBlur={this.inputBlurHandler.bind(this, 'shutter_speed')}
                valid={this.state.postForm['shutter_speed'].valid}
                touched={this.state.postForm['shutter_speed'].touched}
                value={this.state.postForm['shutter_speed'].value}
              />
              <Input
                id="aperture"
                label="aperture"
                control="input"
                onChange={this.postInputChangeHandler}
                onBlur={this.inputBlurHandler.bind(this, 'aperture')}
                valid={this.state.postForm['aperture'].valid}
                touched={this.state.postForm['aperture'].touched}
                value={this.state.postForm['aperture'].value}
              />
            </div>
            <div>
              <Input
                id="camera"
                label="camera"
                control="input"
                onChange={this.postInputChangeHandler}
                onBlur={this.inputBlurHandler.bind(this, 'camera')}
                valid={this.state.postForm['camera'].valid}
                touched={this.state.postForm['camera'].touched}
                value={this.state.postForm['camera'].value}
              />
              <Input
                id="lens"
                label="lens"
                control="input"
                onChange={this.postInputChangeHandler}
                onBlur={this.inputBlurHandler.bind(this, 'lens')}
                valid={this.state.postForm['lens'].valid}
                touched={this.state.postForm['lens'].touched}
                value={this.state.postForm['lens'].value}
              />
            </div>
            <div>
              <Input
                id="equipment"
                label="equipment"
                control="input"
                onChange={this.postInputChangeHandler}
                onBlur={this.inputBlurHandler.bind(this, 'equipment')}
                valid={this.state.postForm['equipment'].valid}
                touched={this.state.postForm['equipment'].touched}
                value={this.state.postForm['equipment'].value}
              />
              <Input
                id="edit_soft"
                label="edit_soft"
                control="input"
                onChange={this.postInputChangeHandler}
                onBlur={this.inputBlurHandler.bind(this, 'edit_soft')}
                valid={this.state.postForm['edit_soft'].valid}
                touched={this.state.postForm['edit_soft'].touched}
                value={this.state.postForm['edit_soft'].value}
              />
            </div>
          </form>
        </Modal>
      </Fragment>
    ) : null;
  }
}

export default FeedEdit;

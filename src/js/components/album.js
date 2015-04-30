var React = require('react');

class Album extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    return (
      <div className="col-xs-3 album">
        <a href="#" className="thumbnail">
          <img src={ this.props.album.images[0].url } />
          <div className="album-name">
            { this.props.album.name }
          </div>
        </a>
      </div>
    );
  }
}

module.exports = Album;

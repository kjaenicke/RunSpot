var React = require('react');

class Track extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
      var durationString = '';

      if(this.props.track.duration_ms){
        var duration = this.props.track.duration_ms;
        var durationSeconds = Math.round(duration / 1000);
        var durationMinutes = Math.round(durationSeconds / 60)
        var durationSecondsRemainder = Math.abs(durationSeconds - (durationMinutes * 60));
        durationString = durationMinutes + ':' + (durationSecondsRemainder < 10 ? '0' + durationSecondsRemainder : durationSecondsRemainder);
      }

      if(this.props.track.album){
        return (
          <tr>
            <td style={{ 'text-align': 'center' }}>
              <div>
                <a href="#">
                  <img src={ this.props.track.album.images[0].url } />
                  <div>
                    { this.props.track.album.name }
                  </div>
                </a>
              </div>
            </td>
            <td>{ this.props.track.track_number }</td>
            <td>{ this.props.track.name }</td>
            <td>{ durationString }</td>
          </tr>
        );
      }
      else {
        return (<tr className="album">
            <td>
            </td>
            <td>{ this.props.track.name }</td>
            <td>{ this.props.track.track_number }</td>
          </tr>
        );
      }
  }
}

module.exports = Track;

/** @jsx React.DOM */

jest.dontMock('../');

describe('SoundCloud Component', function() {
  beforeEach(function() {
    React = require('react/addons');
    SoundCloud = require('../');
    TestUtils = React.addons.TestUtils;

    /**
     * Mock out SoundCloud widget API
     */

    widgetMock = {
      load: jest.genMockFunction()
    }; 

    window.SC = {
      Widget: jest.genMockFunction().mockReturnValue(widgetMock)
    };

    /**
     * Use a container to avoid manipulating props directly 
     * on the rendered soundcloud component.
     */
    
    Container = React.createClass({
      getInitialState: function() {
        return {
          url: 'https://soundcloud.com/hucci/hitta'
        };
      },

      _changeUrl: function() {
        this.setState({url: 'https://soundcloud.com/hudsonmohawke/chimes'});
      },

      render: function() {
        return (
          <div>
            <button onClick={this._changeUrl}>change</button>
            <SoundCloud url={this.state.url}/>
          </div>
        );
      }
    });

    container = TestUtils.renderIntoDocument(<Container />);
    soundcloud = TestUtils.findRenderedComponentWithType(container, SoundCloud);
  });

  it('should render a SoundCloud API ready iframe', function() {
    var iframe = TestUtils.findRenderedDOMComponentWithTag(soundcloud, 'iframe').getDOMNode();

    expect(iframe.getAttribute('id')).toBe('react-sc-player');
    expect(iframe.getAttribute('src')).toBe('https://w.soundcloud.com/player/?url=' );
  });

  it('should create a new SoundCloud widget', function() {
    expect(SC.Widget.mock.calls[0][0]).toBe('react-sc-player');
  });

  it('should load a `url` into the widget when created', function() {
    expect(widgetMock.load.mock.calls[0][0]).toBe('https://soundcloud.com/hucci/hitta')
  });

  it('should be able to load new `url`s', function() {
    var changeUrl = TestUtils.findRenderedDOMComponentWithTag(container, 'button');

    TestUtils.Simulate.click(changeUrl);

    expect(widgetMock.load.mock.calls.length).toBe(2);
    expect(widgetMock.load.mock.calls[1][0]).toBe('https://soundcloud.com/hudsonmohawke/chimes');
  });

  it('wont load a `url` if its already loaded', function() {
    // force the same url to be passed to soundcloud
    container.forceUpdate();

    // should not have been loaded again.
    expect(widgetMock.load.mock.calls.length).toBe(1);
  });
});

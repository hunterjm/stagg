import PropTypes from 'prop-types';
import { LoaderStyled } from './LoaderStyled';
import { animated, useTransition } from 'react-spring';

const Loader = ({ showLoader }) => {
  const loaderTransition = useTransition(showLoader, null, {
    from: {
      opacity: 0,
      position: 'fixed',
      top: '0px',
      left: '0',
      width: '100vw',
      height: '100vh',
      zIndex: '10',
    },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  return (
    <>
    {loaderTransition.map(
      ({ item, key, props: animation }) =>
        item && (
          <animated.div key={key} style={animation}>
            <LoaderStyled className="loader">
              <div className="loader__content">
                <i className="loader__stagg-icon icon-stagg-antlers"></i>
              </div>
            </LoaderStyled>
          </animated.div>
        )
    )}
    </>
  )
};

Loader.propTypes = {
  showLoader: PropTypes.bool.isRequired,
};

export default Loader;

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import styles from './Overlay.module.scss';

export function Overlay({showBackdrop = false}) {
  const spinner = (
    <CircularProgress className={styles.overlay}/>
  );

  if (!!showBackdrop) {
    return (
      <Backdrop
        sx={{zIndex: theme => theme.zIndex.drawer + 1}}
        open={true}
      >
        {spinner}
      </Backdrop>
    );
  }
  return <>{spinner}</>;
}

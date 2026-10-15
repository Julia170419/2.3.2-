import { useDisclosure } from '@mantine/hooks';
import Header from '../Modules/Header/Header';
import Main from './../Modules/Main/Main';
import Popup from '../Modules/Popup/Popup';

const VegetablesShop = () => {
    const [opened, { toggle, close }] = useDisclosure(false);

    return (
        <>
            <Header onCartClick={toggle}/>
            <Popup opened={opened} onClose={close} />
            <Main />
        </>
    )
}

export default VegetablesShop;
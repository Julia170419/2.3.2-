import type { VegetableCard } from '../../types/VegetableCard'
import ActionButton from '../../UI/ActionButton/ActionButton'
import styles from './style.module.css'

export default function PopupCard ({
    id,
    name,
    image,
    price,
    count,
 }: VegetableCard) {
    return (
        <div className={styles.container}>
            <img className={styles.img} src={image} alt={name} />
            <div className={styles['text-container']}>
                <span className={styles.title}>{name.split('-').shift()}</span>
                <span className={styles.weight}>{name.split('-').pop()?.toLowerCase()}</span>
            </div>
            <div className={styles['price-container']}>
                <span className={styles.price}>$ {price}</span>
                <ActionButton 
                item={{name, image, price, count, id}}
                />
            </div>
        </div>
    )
}
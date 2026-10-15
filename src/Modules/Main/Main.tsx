import ky from 'ky';
import VegetableCard from '../../Components/VegetableCard'
import { useEffect, useState } from 'react';
import styles from './style.module.css'

export default function Main () {
    type Vegetable = {
        id: string,
        name: string,
        price: number,
        image: string
    }

    const [vegetables, setVegetables] = useState<Vegetable[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadingVegetables = async () => {
            try {
                const data = await ky.get('https://res.cloudinary.com/sivadass/raw/upload/v1535817394/json/products.json').json<Vegetable[]>();
                setVegetables(data);
            } catch (error) {
                setError('Error')
            }
            finally {
                setLoading(false)
            }
        }
        loadingVegetables();
    }, [])

    if (loading) return <div>Loader...</div>;
    if (error) return <div>{error}</div>;

    return (
        <main className={styles.main}>
            <h1 className={styles.title}>Catalog</h1>
            <ul className={styles['vegetable-list']}>
                {vegetables.map(vegetable => (<li key={vegetable.id}>
                    <VegetableCard 
                    id={vegetable.id}
                    name={vegetable.name}
                    image={vegetable.image}
                    price={vegetable.price}
                    count={0}
                    />
                </li>))}
            </ul>
        </main>
    )
}
import type { VegetableCard } from "../types/VegetableCard";

import { createContext, useEffect, useState } from "react"
import type { ReactNode } from "react"

type ContextType = {
    basket: VegetableCard[];
    addBasket: (vegetable: VegetableCard) => void;
    plusOneBasket: (veg: VegetableCard) => void;
    minusOneBasket: (veg: VegetableCard) => void;
}
export const CustomContext = createContext<ContextType | null>(null)

type ContextProps = {
    children: ReactNode
}
export const Context = ({ children }: ContextProps) => {
    const [basket, setBasket] = useState<VegetableCard[]>([])

    useEffect(() => {
        localStorage.setItem('basket', JSON.stringify(basket))
    }, [basket])

    const addBasket = (vegetable: VegetableCard) => {
        setBasket(prev => {
            const existing = prev.find(prev => prev.id === vegetable.id)
            const addCount = vegetable.count ?? vegetable.count > 0 ? vegetable.count : 1
            if (existing) {
                return prev.map(item => item.id === vegetable.id ? 
                    {...item, count: vegetable.count} : item
                )
            }
            return [...prev, {
            ...vegetable,
            count: addCount
        }]
        })
    }

    const plusOneBasket = (vegetable: VegetableCard) => {
    setBasket(prev => {
        const existing = prev.find(item => item.id === vegetable.id);

        if (existing) {
            return prev.map(item =>
                item.id === vegetable.id ? { ...item, count: item.count + 1 } : item
            );
        }

        return [...prev, {
            ...vegetable,
            count: 1
        }]
    });
    };
    
    const minusOneBasket = (veg: VegetableCard) => {
        setBasket(prev => {
            const item = prev.find(item => item.id === veg.id);
            if (!item) return prev;
            if (item.count === 1) {
                return prev.filter(item => item.id !== veg.id)
            }
            return prev.map(item => 
                item.id === veg.id ? {...item, count: item.count - 1} : item
            )
        })
    }

    useEffect(() => {
        const saved = localStorage.getItem('basket')
        if ( saved) {
            setBasket(JSON.parse(saved))
        }
    }, [])

    const value: ContextType = {
        basket,
        addBasket,
        plusOneBasket,
        minusOneBasket
    }

    return <CustomContext.Provider value={value}>
        {children}
    </CustomContext.Provider>
}
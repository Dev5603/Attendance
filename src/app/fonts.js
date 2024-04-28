import { Alata, Josefin_Sans } from 'next/font/google'

export const alata = Alata({
    weight: ['400'],
    subsets: ['latin'],
    variable: '--ff-alata'
})

export const josefin = Josefin_Sans({
    weight: ['100', '200', '300', '400', '500', '600', '700'],
    subsets: ['latin'],
    variable: '--ff-josefin'
})
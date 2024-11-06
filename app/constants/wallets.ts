export type Wallet = {
  id: string;
  name: string;
  image: string;
}

type WalletsByCountry = {
    [key: string]: Wallet[];
  };

  export const walletsByCountry: WalletsByCountry = {
    EC: [
      {id: 'deuna', name: 'Deuna!', image: 'https://firebasestorage.googleapis.com/v0/b/qik_feedback/o/wallets%2Fdeuna.png?alt=media&token=c5639ab7-5f10-4736-8492-37634358f505'},
      {id: 'payphone', name: 'Payphone', image: 'https://firebasestorage.googleapis.com/v0/b/qik_feedback/o/wallets%2Fpayphone.png?alt=media&token=6c219157-a6a5-441b-8025-786a264af079'},
    ],
    CO: [
      {id: 'nequi', name: 'Nequi', image: 'https://firebasestorage.googleapis.com/v0/b/qik_feedback/o/wallets%2Fnequi.png?alt=media&token=57021f2c-2dd3-412a-8075-25c169dc3643'},
      {id: 'daviplata', name: 'DaviPlata', image: 'https://firebasestorage.googleapis.com/v0/b/qik_feedback/o/wallets%2Fdaviplata.png?alt=media&token=8dd7c78b-0d71-479b-9887-7543ebca83b9'},
      {id: 'dale', name: 'Dale!', image: 'https://firebasestorage.googleapis.com/v0/b/qik_feedback/o/wallets%2Fdale.png?alt=media&token=8d0cf6f5-32d7-4d05-b4f8-6706fcbc4abe'}
    ],
  }

  export const commonPaymentMethods: Wallet[] = [
    {id: 'credit-card', name: 'Tarjeta', image: 'https://firebasestorage.googleapis.com/v0/b/qik_feedback/o/wallets%2Fcredit-card.png?alt=media&token=412d037b-752e-4541-88d3-7fd9ccd48b6d'},
    {id: 'cash', name: 'Efectivo', image: 'https://firebasestorage.googleapis.com/v0/b/qik_feedback/o/wallets%2Fcash.png?alt=media&token=10d2b5b7-76a0-4e88-a422-3c358bd5f8c7'},
    {id: 'transfer', name: 'Transferencia', image: 'https://firebasestorage.googleapis.com/v0/b/qik_feedback/o/wallets%2Ftransfer.png?alt=media&token=43f169ae-7de2-4fa4-90c1-591599054b88'},

  ] 
  export const walletsIdsByCountry: { [key: string]: [string, ...string[]] } = Object.fromEntries(
    Object.entries(walletsByCountry).map(([country, wallets]) => {
      const ids = wallets.map(wallet => wallet.id);
      return [country, [ids[0], ...ids.slice(1)]]; // Ensure at least one element and include commonPaymentMethods
    })
  )

  export function walletsIdsByCountryWithCommon(country: string): [string, ...string[]] {
    switch (country) {
      case 'EC':
        return [walletsByCountry['EC'][0].id, ...walletsByCountry['EC'].slice(1).map(wallet => wallet.id), ...commonPaymentMethods.map(wallet => wallet.id)];
      case 'CO':
        return [walletsByCountry['CO'][0].id, ...walletsByCountry['CO'].slice(1).map(wallet => wallet.id), ...commonPaymentMethods.map(wallet => wallet.id)];
      default:
        return [commonPaymentMethods[0].id, ...commonPaymentMethods.slice(1).map(wallet => wallet.id)];
    }
  }

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_ENV?: string
  readonly VITE_DEFAULT_MODE?: string
  readonly VITE_DEFAULT_BATTERYCAPACITY?: string
  readonly VITE_DEFAULT_PRICEPERKWH?: string
  readonly VITE_DEFAULT_FEETYPE?: string
  readonly VITE_DEFAULT_STARTINGFEE?: string
  readonly VITE_DEFAULT_TRANSACTIONFEEPERCENT?: string
  readonly VITE_DEFAULT_PETROLPRICE?: string
  readonly VITE_DEFAULT_PETROLUSAGE?: string
  readonly VITE_DEFAULT_KWHUSAGE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

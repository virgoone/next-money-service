import { z } from 'zod'

import { Hashids } from '@/utils/hashid'

export const ChargeOrderHashids = Hashids('ChargeOrder', 12)

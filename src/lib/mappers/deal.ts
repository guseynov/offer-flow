import type {
  Deal,
  DealDetail,
  DealDto,
  DealCreateFormValues,
  CreateDealPayload,
  DealFormValues,
  UpdateDealPayload,
} from "@/types/deal";

const categoryLabels: Record<string, string> = {
  "food-drink": "Food & drink",
  wellness: "Wellness",
  home: "Home",
  experiences: "Experiences",
  services: "Services",
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "UTC",
});

export function mapDealDtoToDeal(dto: DealDto): Deal {
  return {
    id: dto.id,
    title: dto.title,
    category: dto.category,
    categoryLabel: categoryLabels[dto.category] ?? dto.category,
    formattedPrice: currencyFormatter.format(dto.priceCents / 100),
    status: dto.status,
    partnerName: dto.partnerName,
    dateRangeLabel: `${dateFormatter.format(new Date(dto.startsAt))} – ${dateFormatter.format(new Date(dto.endsAt))}`,
    updatedAtLabel: dateTimeFormatter.format(new Date(dto.updatedAt)),
  };
}

export function mapDealDtoToDetail(dto: DealDto): DealDetail {
  return {
    ...mapDealDtoToDeal(dto),
    description: dto.description,
    startsAtLabel: dateTimeFormatter.format(new Date(dto.startsAt)),
    endsAtLabel: dateTimeFormatter.format(new Date(dto.endsAt)),
    createdAtLabel: dateTimeFormatter.format(new Date(dto.createdAt)),
  };
}

export function mapDealDtosToDeals(dtos: DealDto[]): Deal[] {
  return dtos.map(mapDealDtoToDeal);
}

function toDateTimeLocalValue(isoDate: string): string {
  return isoDate.slice(0, 16);
}

export function mapDealDtoToFormValues(dto: DealDto): DealFormValues {
  return {
    title: dto.title,
    description: dto.description,
    category: dto.category,
    price: (dto.priceCents / 100).toFixed(2),
    status: dto.status,
    partnerId: dto.partnerId,
    startsAt: toDateTimeLocalValue(dto.startsAt),
    endsAt: toDateTimeLocalValue(dto.endsAt),
  };
}

export function mapDealFormValuesToUpdatePayload(
  values: DealFormValues,
  expectedUpdatedAt: string,
): UpdateDealPayload {
  return {
    title: values.title.trim(),
    description: values.description.trim(),
    category: values.category,
    priceCents: Math.round(Number(values.price) * 100),
    partnerId: values.partnerId,
    startsAt: new Date(`${values.startsAt}:00.000Z`).toISOString(),
    endsAt: new Date(`${values.endsAt}:00.000Z`).toISOString(),
    expectedUpdatedAt,
  };
}


export function mapDealCreateFormValuesToPayload(
  values: DealCreateFormValues,
): CreateDealPayload {
  return {
    title: values.title.trim(),
    description: values.description.trim(),
    category: values.category,
    priceCents: Math.round(Number(values.price) * 100),
    status: values.status,
    partnerId: values.partnerId,
    startsAt: new Date(`${values.startsAt}:00.000Z`).toISOString(),
    endsAt: new Date(`${values.endsAt}:00.000Z`).toISOString(),
  };
}

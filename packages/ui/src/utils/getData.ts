import { faker } from "@faker-js/faker";

export function getData() {
  faker.seed(123);

  const data: { id: number; name: string; avatarUrl?: string }[] = [];
  for (let i = 0; i < 1000; i++) {
    const name = `${faker.person.firstName()} ${faker.person.lastName()}`;
    data.push({
      id: i,
      name,
      avatarUrl: faker.datatype.boolean(0.3)
        ? `https://i.pravatar.cc/150?u=${encodeURIComponent(name)}`
        : undefined,
    });
  }
  return data;
}

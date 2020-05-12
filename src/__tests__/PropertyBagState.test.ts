/* eslint-disable @typescript-eslint/no-explicit-any */
import { PCFPropertyBagStateManager } from "../PropertyBagState";

test("Primitive Value Changed OutBound", async () => {
  const convertToLocalDate = jest.fn();
  const propBag = new PCFPropertyBagStateManager(convertToLocalDate);

  // Mock updating a value from the PCF control
  propBag.updateProperties({
    textField: "foo",
  });
  let changed = propBag.getOutboundChangedProperties() as any;
  expect(changed.textField).toBe("foo");

  // Mock updating to new value
  propBag.updateProperties({
    textField: "foo",
  });
  changed = propBag.getOutboundChangedProperties() as any;
  expect(changed.textField).toBeUndefined();

  // Mock updating to new value
  propBag.updateProperties({
    textField: "bar",
  });
  changed = propBag.getOutboundChangedProperties() as any;
  expect(changed.textField).toBe("bar");
});

test("Primitive Value Changed InBound", async () => {
  const convertToLocalDate = jest.fn();
  const propBag = new PCFPropertyBagStateManager(convertToLocalDate);

  // Set all the values from the initial values
  propBag.setAllProperties({
    textField: {
      type: "SingleLine.Text",
      raw: "foo",
    } as ComponentFramework.PropertyTypes.StringProperty,
  });

  // Mock updating a value from the PCF control - with no chane
  let changed = propBag.getInboundChangedProperties(
    {
      textField: {
        type: "SingleLine.Text",
        raw: "foo",
      } as ComponentFramework.PropertyTypes.StringProperty,
    },
    ["textField"],
  );

  expect(changed.length).toBe(0);

  // Mock changing a value
  changed = propBag.getInboundChangedProperties(
    {
      textField: {
        type: "SingleLine.Text",
      } as ComponentFramework.PropertyTypes.StringProperty,
    },
    ["textField"],
  );

  expect(changed).toContain("textField");
});

test("Date Value not converted outbound", async () => {
  const convertToLocalDate = jest.fn();
  const propBag = new PCFPropertyBagStateManager(convertToLocalDate);

  const date = new Date("2020-02-01");
  // Mock updating a value from the PCF control
  propBag.updateProperties({
    datefield: date,
  });

  const changed = propBag.getOutboundChangedProperties() as any;
  expect(changed.datefield).toBe(date);
});

test("Date Value converted inbound", async () => {
  const convertToLocalDate = jest
    .fn()
    .mockImplementation((a: ComponentFramework.PropertyTypes.DateTimeProperty) => a.raw);
  const propBag = new PCFPropertyBagStateManager(convertToLocalDate);

  const date = new Date("2020-02-01 14:00");

  // Set all the values from the initial values
  propBag.setAllProperties({
    dateField: {
      type: "DateAndTime.DateAndTime",
      raw: date,
    } as ComponentFramework.PropertyTypes.DateTimeProperty,
  });

  // Expect that we have called the convert to local date format
  // see http://develop1.net/public/post/2020/05/11/pcf-datetimes-the-saga-continues
  expect(convertToLocalDate).toBeCalledTimes(1);

  // Mock updating a value from the PCF control - with no chane
  let changed = propBag.getInboundChangedProperties(
    {
      dateField: {
        type: "DateAndTime.DateAndTime",
        raw: date,
      } as ComponentFramework.PropertyTypes.DateTimeProperty,
    },
    ["dateField"],
  );

  // Expect that we have called the convert to local date format
  expect(convertToLocalDate).toBeCalledTimes(2);

  // Since the date didn't change, we should not have any changed properties
  expect(changed.length).toBe(0);

  // Mock changing a value
  const date2 = new Date("2020-02-01 15:00");
  changed = propBag.getInboundChangedProperties(
    {
      dateField: {
        type: "DateAndTime.DateAndTime",
        raw: date2,
      } as ComponentFramework.PropertyTypes.DateTimeProperty,
    },
    ["dateField"],
  );

  expect(changed).toContain("dateField");
});

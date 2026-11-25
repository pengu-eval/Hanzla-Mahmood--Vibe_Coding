import { describe, it, expect, vi, afterEach } from "vitest";
import { insertStudent, getStudent, updateStudent, deleteStudent } from "./api";

const BASE = "http://localhost:5000/api/students";

const stubFetch = (ok: boolean, body: unknown) => {
  const fn = vi.fn().mockResolvedValue({ ok, json: async () => body });
  vi.stubGlobal("fetch", fn);
  return fn;
};

const student = { rollNo: "R1", name: "Ali", department: "CS", semester: 3, age: 20 };

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("insertStudent", () => {
  it("POSTs the student as JSON and returns the response body", async () => {
    const fetchMock = stubFetch(true, { message: "ok", student });
    const result = await insertStudent(student);

    expect(fetchMock).toHaveBeenCalledWith(BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(student),
    });
    expect(result).toEqual({ message: "ok", student });
  });

  it("throws the server error message on failure", async () => {
    stubFetch(false, { error: "Student with this roll number already exists" });
    await expect(insertStudent(student)).rejects.toThrow(
      "Student with this roll number already exists"
    );
  });

  it("throws a fallback message when the server gives no error", async () => {
    stubFetch(false, {});
    await expect(insertStudent(student)).rejects.toThrow("Failed to insert student");
  });
});

describe("getStudent", () => {
  it("GETs the student by roll number", async () => {
    const fetchMock = stubFetch(true, student);
    const result = await getStudent("R1");

    expect(fetchMock).toHaveBeenCalledWith(`${BASE}/R1`);
    expect(result).toEqual(student);
  });

  it("throws the server error message when not found", async () => {
    stubFetch(false, { error: "Student not found" });
    await expect(getStudent("missing")).rejects.toThrow("Student not found");
  });

  it("throws a fallback message when the server gives no error", async () => {
    stubFetch(false, {});
    await expect(getStudent("missing")).rejects.toThrow("Failed to fetch student");
  });
});

describe("updateStudent", () => {
  it("PUTs the updated fields to the roll number URL", async () => {
    const { rollNo, ...fields } = student;
    const fetchMock = stubFetch(true, { message: "updated", student });
    const result = await updateStudent(rollNo, fields);

    expect(fetchMock).toHaveBeenCalledWith(`${BASE}/R1`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    });
    expect(result).toEqual({ message: "updated", student });
  });

  it("throws a fallback message when the server gives no error", async () => {
    const { rollNo, ...fields } = student;
    stubFetch(false, {});
    await expect(updateStudent(rollNo, fields)).rejects.toThrow("Failed to update student");
  });
});

describe("deleteStudent", () => {
  it("sends DELETE to the roll number URL", async () => {
    const fetchMock = stubFetch(true, { message: "deleted" });
    const result = await deleteStudent("R1");

    expect(fetchMock).toHaveBeenCalledWith(`${BASE}/R1`, { method: "DELETE" });
    expect(result).toEqual({ message: "deleted" });
  });

  it("throws the server error message on failure", async () => {
    stubFetch(false, { error: "Student not found" });
    await expect(deleteStudent("R1")).rejects.toThrow("Student not found");
  });
});

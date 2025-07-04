import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // wantCoffeeChat 값을 'O'/'X'로 변환
    const transformedData = {
      ...data,
      wantCoffeeChat: data.wantCoffeeChat ? "O" : "X",
    };

    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbxH82ZgnBbyrJbZ5VZYawOG6WvfKN3ruZRr4J_ZSurh7JgP0lBnwLwJe6p_o3dF3Ve8zA/exec",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transformedData),
      },
    );

    const text = await response.text(); // body를 한 번만 읽음

    if (!response.ok) {
      return NextResponse.json(
        { error: "Apps Script 오류", detail: text },
        { status: 500 },
      );
    }

    // JSON 파싱 시도
    let result;
    try {
      result = JSON.parse(text);
    } catch (e) {
      return NextResponse.json(
        { error: "JSON 파싱 오류", detail: text },
        { status: 500 },
      );
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: "서버 내부 오류", detail: error?.message },
      { status: 500 },
    );
  }
}

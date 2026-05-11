import { NextRequest } from "next/server";
import puppeteer from "puppeteer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      name,
      email,
      phone,
      socialMedia,
      summary,
      skills,
      educationEntries,
      experienceEntries,
      miscFields,
    } = body;

    const browser = await puppeteer.launch({
      headless: true,
    });

    const page = await browser.newPage();

    const formatDate = (iso: string) => {
      if (!iso) return "";

      const [y, m, d] = iso.split("-");

      return `${d}/${m}/${y}`;
    };

    const educationHTML = educationEntries
      ?.map(
        (edu: any) => `
          <div class="section-item">
            <h3>${edu.title || ""}</h3>
            <p class="organization">${edu.organisation || ""}</p>
            <p class="meta">
              ${edu.city || ""} ${edu.country ? `, ${edu.country}` : ""}
            </p>

            <div>
              ${edu.subjects || ""}
            </div>
          </div>
        `
      )
      .join("");

    const experienceHTML = experienceEntries
      ?.map(
        (exp: any) => `
          <div class="section-item">
            <h3>${exp.occupation || ""}</h3>
            <p class="organization">${exp.employer || ""}</p>
            <p class="meta">
              ${exp.city || ""} ${exp.country ? `, ${exp.country}` : ""}
            </p>

            <div>
              ${exp.activities || ""}
            </div>
          </div>
        `
      )
      .join("");

    const miscHTML = miscFields
      ?.map(
        (field: any) => `
          <div class="section">
            <h2>${field.label}</h2>

            <div>
              ${field.value}
            </div>
          </div>
        `
      )
      .join("");

    await page.setContent(`
<html>
<head>
<style>
    body {
        font-family: Arial, sans-serif;
        padding: 22px;
        color: #1e293b;
        line-height: 1;
        font-size: 12px;
    }

    h1 {
        text-align: center;
        font-size: 30px;
        margin-bottom: 10px;
        font-weight: bold;
    }

    h2 {
        font-size: 22px;
        margin-top: 35px;
        margin-bottom: 18px;
        border-bottom: 1px solid #cbd5e1;
        padding-bottom: 6px;
        font-weight: 600;
    }

    h3 {
        font-size: 18px;
        margin: 0;
        font-weight: bold;
        line-height: 1.2;
    }

    p {
        margin: 0;
    }

    .contact {
        text-align: center;
        color: #475569;
        font-size: 14px;
        margin-bottom: 10px;
    }

    .section-item {
        margin-bottom: 28px;
    }

    .row {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 20px;
    }

    .left {
        flex: 1;
    }

    .right {
        text-align: right;
        color: #64748b;
        font-size: 13px;
        white-space: nowrap;
    }

    .organization {
        color: #334155;
        line-height: 1.2;
        margin-top: 2px;
    }

    .content {
        margin-top: 12px;
    }

    ul {
        padding-left: 20px;
        margin-top: 8px;
    }

    li {
        margin-bottom: 5px;
    }

    a {
        color: #2563eb;
        text-decoration: underline;
    }
</style>
</head>

<body>

    <h1>${name || ""}</h1>

    <div class="contact">
        ${phone || ""}
        ${phone && email ? " | " : ""}
        ${email || ""}
        ${socialMedia
        ? ` | ${socialMedia.replace(/<[^>]+>/g, "")}`
        : ""
      }
    </div>

    ${summary
        ? `
            <div>
                <h2>Summary</h2>
                <div>${summary}</div>
            </div>
        `
        : ""
      }

    ${educationEntries?.length
        ? `
            <div>
                <h2>Education</h2>

                ${educationEntries
          .map(
            (edu: any) => `
                        <div class="section-item">

                            <div class="row">

                                <div class="left">
                                    <h3>${edu.title || ""}</h3>

                                    <p class="organization">
                                        ${edu.organisation || ""}
                                    </p>
                                </div>

                                <div class="right">
                                    <p>
                                        ${edu.from
                ? formatDate(edu.from)
                : ""
              }
                                        -
                                        ${edu.ongoing
                ? "Present"
                : edu.to
                  ? formatDate(edu.to)
                  : ""
              }
                                    </p>

                                    <p>
                                        ${edu.city || ""}
                                        ${edu.country
                ? `, ${edu.country}`
                : ""
              }
                                    </p>
                                </div>

                            </div>

                            <div class="content">
                                ${edu.subjects || ""}
                            </div>

                        </div>
                    `
          )
          .join("")}
            </div>
        `
        : ""
      }

    ${experienceEntries?.length
        ? `
            <div>
                <h2>Experience</h2>

                ${experienceEntries
          .map(
            (exp: any) => `
                        <div class="section-item">

                            <div class="row">

                                <div class="left">
                                    <h3>${exp.occupation || ""}</h3>

                                    <p class="organization">
                                        ${exp.employer || ""}
                                    </p>
                                </div>

                                <div class="right">
                                    <p>
                                        ${exp.from
                ? formatDate(exp.from)
                : ""
              }
                                        -
                                        ${exp.ongoing
                ? "Present"
                : exp.to
                  ? formatDate(exp.to)
                  : ""
              }
                                    </p>

                                    <p>
                                        ${exp.city || ""}
                                        ${exp.country
                ? `, ${exp.country}`
                : ""
              }
                                    </p>
                                </div>

                            </div>

                            <div class="content">
                                ${exp.activities || ""}
                            </div>

                        </div>
                    `
          )
          .join("")}
            </div>
        `
        : ""
      }

    ${skills
        ? `
            <div>
                <h2>Skills</h2>
                <div>${skills}</div>
            </div>
        `
        : ""
      }

    ${miscFields
        ?.map(
          (field: any) => `
                <div>
                    <h2>${field.label}</h2>

                    <div>
                        ${field.value}
                    </div>
                </div>
            `
        )
        .join("") || ""
      }

</body>
</html>
`);

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    return new Response(Buffer.from(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          "attachment; filename=resume.pdf",
      },
    });
  } catch (error) {
    console.log(error);

    return Response.json(
      {
        success: false,
        message: "Failed to generate PDF",
      },
      {
        status: 500,
      }
    );
  }
}
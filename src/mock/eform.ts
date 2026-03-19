import type {
  EFormBusinessType,
  FormFieldCoord,
  FormSessionRecord,
} from '@/types/form';

export function coord(
  id: string,
  templateId: string,
  fieldKey: string,
  label: string,
  required = true,
  page = 1,
): FormFieldCoord {
  return { id, templateId, fieldKey, label, page, x1: 0, y1: 0, x2: 0, y2: 0, fontSize: 10, required };
}

export const MOCK_BUSINESS_TYPES: EFormBusinessType[] = [
  {
    id: 'BT_LOAN',
    name: '貸款業務',
    description: '農會信用部貸款授信相關申請表單',
    active: true,
    templates: [
      {
        id: 'FT_LOAN_APPLY',
        businessTypeId: 'BT_LOAN',
        name: '授信申請書',
        pdfFileName: '汐止區農會授信申請書.pdf',
        active: true,
        fields: [
          coord('F001', 'FT_LOAN_APPLY', 'applicant_name',       '申請人姓名',   true),
          coord('F002', 'FT_LOAN_APPLY', 'applicant_id_number',  '身分證字號',   true),
          coord('F003', 'FT_LOAN_APPLY', 'applicant_birth_date', '出生（設立）日期', true),
          coord('F004', 'FT_LOAN_APPLY', 'applicant_address',    '住址（營業處所）', true),
        ],
      },
      {
        id: 'FT_LOAN_PERSONAL',
        businessTypeId: 'BT_LOAN',
        name: '個人資料表',
        pdfFileName: '個人資料表.pdf',
        active: true,
        fields: [
          coord('F005', 'FT_LOAN_PERSONAL', 'applicant_name',       '姓名',         true),
          coord('F006', 'FT_LOAN_PERSONAL', 'applicant_id_number',  '身分證統一編號', true),
          coord('F007', 'FT_LOAN_PERSONAL', 'applicant_birth_date', '出生日期',      true),
          coord('F008', 'FT_LOAN_PERSONAL', 'applicant_address',    '戶籍地',        true),
          coord('F009', 'FT_LOAN_PERSONAL', 'applicant_phone',      '電話（手機）',   false),
          coord('F010', 'FT_LOAN_PERSONAL', 'applicant_email',      'E-mail',        false),
        ],
      },
      {
        id: 'FT_LOAN_RELATION',
        businessTypeId: 'BT_LOAN',
        name: '同一關係人資料表',
        pdfFileName: '汐止區農會同一關係人資料表.pdf',
        active: true,
        fields: [
          coord('F011', 'FT_LOAN_RELATION', 'applicant_name',      '姓名',         true),
          coord('F012', 'FT_LOAN_RELATION', 'applicant_id_number', '身分證統一編號', true),
          coord('F013', 'FT_LOAN_RELATION', 'applicant_phone',     '聯絡電話',      false),
        ],
      },
    ],
  },
  {
    id: 'BT_INHERIT',
    name: '繼承業務',
    description: '帳戶繼承相關申請表單',
    active: true,
    templates: [
      {
        id: 'FT_INHERIT_APPLY',
        businessTypeId: 'BT_INHERIT',
        name: '繼承申請書',
        pdfFileName: '繼承申請書.pdf',
        active: true,
        fields: [
          coord('F020', 'FT_INHERIT_APPLY', 'applicant_name', '申請人姓名', true),
        ],
      },
      {
        id: 'FT_INHERIT_SEAL',
        businessTypeId: 'BT_INHERIT',
        name: '印鑑卡',
        pdfFileName: '印鑑卡.pdf',
        active: true,
        fields: [
          coord('F021', 'FT_INHERIT_SEAL', 'applicant_name',  '姓名',     true),
          coord('F022', 'FT_INHERIT_SEAL', 'applicant_phone', '聯絡電話', false),
        ],
      },
      {
        id: 'FT_INHERIT_BANKBOOK',
        businessTypeId: 'BT_INHERIT',
        name: '存摺申請書',
        pdfFileName: '存摺申請書.pdf',
        active: true,
        fields: [
          coord('F023', 'FT_INHERIT_BANKBOOK', 'applicant_name',       '姓名',         true),
          coord('F024', 'FT_INHERIT_BANKBOOK', 'applicant_phone',      '聯絡電話',      false),
          coord('F025', 'FT_INHERIT_BANKBOOK', 'applicant_birth_date', '出生日期',      true),
          coord('F026', 'FT_INHERIT_BANKBOOK', 'applicant_id_number',  '身分證字號',    true),
        ],
      },
    ],
  },
  {
    id: 'BT_OPEN_ACCOUNT',
    name: '開戶業務',
    description: '新帳戶開立相關申請表單',
    active: true,
    templates: [
      {
        id: 'FT_OA_APPLY',
        businessTypeId: 'BT_OPEN_ACCOUNT',
        name: '開戶申請書',
        pdfFileName: '開戶申請書.pdf',
        active: true,
        fields: [
          coord('F030', 'FT_OA_APPLY', 'applicant_name',       '姓名',     true),
          coord('F031', 'FT_OA_APPLY', 'applicant_id_number',  '身分證字號', true),
          coord('F032', 'FT_OA_APPLY', 'applicant_birth_date', '出生日期',  true),
          coord('F033', 'FT_OA_APPLY', 'applicant_address',    '戶籍地址',  true),
        ],
      },
      {
        id: 'FT_OA_SEAL',
        businessTypeId: 'BT_OPEN_ACCOUNT',
        name: '印鑑卡',
        pdfFileName: '印鑑卡.pdf',
        active: true,
        fields: [
          coord('F034', 'FT_OA_SEAL', 'applicant_name',  '姓名',     true),
          coord('F035', 'FT_OA_SEAL', 'applicant_phone', '聯絡電話', false),
        ],
      },
      {
        id: 'FT_OA_AGREEMENT',
        businessTypeId: 'BT_OPEN_ACCOUNT',
        name: '約定書',
        pdfFileName: '約定書.pdf',
        active: true,
        fields: [
          coord('F036', 'FT_OA_AGREEMENT', 'applicant_name',      '姓名',     true),
          coord('F037', 'FT_OA_AGREEMENT', 'applicant_id_number', '身分證字號', true),
        ],
      },
    ],
  },
];

export const MOCK_SESSIONS: FormSessionRecord[] = [
  {
    id: 'S001',
    businessTypeId: 'BT_LOAN',
    businessTypeName: '貸款業務',
    templateIds: ['FT_LOAN_APPLY', 'FT_LOAN_PERSONAL'],
    templateNames: ['授信申請書', '個人資料表'],
    createdBy: '王經理',
    createdAt: '2026-03-15 14:30:00',
  },
  {
    id: 'S002',
    businessTypeId: 'BT_OPEN_ACCOUNT',
    businessTypeName: '開戶業務',
    templateIds: ['FT_OA_APPLY', 'FT_OA_SEAL', 'FT_OA_AGREEMENT'],
    templateNames: ['開戶申請書', '印鑑卡', '約定書'],
    createdBy: '王經理',
    createdAt: '2026-03-14 09:15:00',
  },
  {
    id: 'S003',
    businessTypeId: 'BT_INHERIT',
    businessTypeName: '繼承業務',
    templateIds: ['FT_INHERIT_APPLY', 'FT_INHERIT_SEAL'],
    templateNames: ['繼承申請書', '印鑑卡'],
    createdBy: '李主管',
    createdAt: '2026-03-13 16:45:00',
  },
];

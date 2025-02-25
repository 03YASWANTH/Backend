import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

// Define styles for the PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#3B82F6",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1E3A8A",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  label: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#374151",
    width: "40%",
  },
  value: {
    fontSize: 12,
    color: "#6B7280",
    width: "60%",
  },
  table: {
    display: "flex",
    width: "100%",
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingVertical: 5,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#3B82F6",
    paddingVertical: 5,
  },
  tableCell: {
    flex: 1,
    fontSize: 12,
    textAlign: "center",
    color: "#1E3A8A",
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    color: "#FFFFFF",
  },
});

// StudentReportPDF Component
const StudentReportPDF = ({ studentData, attendanceData, allMarksData }) => {

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text>Student Academic Report</Text>
        </View>

        {/* Student Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Student Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>
              {studentData.name.firstName} {studentData.name.lastName}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Student ID:</Text>
            <Text style={styles.value}>{studentData.studentId}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{studentData.email}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Phone Number:</Text>
            <Text style={styles.value}>{studentData.phoneNumber}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Current Year:</Text>
            <Text style={styles.value}>Year {studentData.currentYear}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Semester:</Text>
            <Text style={styles.value}>{studentData.semester}</Text>
          </View>
        </View>

        {/* Parent Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Parent Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Father's Name:</Text>
            <Text style={styles.value}>{studentData.fatherName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Father's Phone:</Text>
            <Text style={styles.value}>{studentData.fatherPhoneNumber}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Mother's Name:</Text>
            <Text style={styles.value}>{studentData.motherName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Mother's Phone:</Text>
            <Text style={styles.value}>{studentData.motherPhoneNumber}</Text>
          </View>
        </View>

        {/* Attendance Data Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Attendance Overview</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderCell}>Month</Text>
              <Text style={styles.tableHeaderCell}>Attendance (%)</Text>
            </View>
            {attendanceData?.monthlyData?.map((month, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{month.month}</Text>
                <Text style={styles.tableCell}>
                  {parseFloat(month.overall.percentage).toFixed(2)}%
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Marks Data Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Academic Performance</Text>
          {Object.entries(allMarksData).map(([examType, marksData]) => (
            <View key={examType} style={styles.section}>
              <Text style={styles.sectionTitle}>
                {examType === "mid1"
                  ? "Mid Term 1"
                  : examType === "mid2"
                  ? "Mid Term 2"
                  : "Semester Grades"}
              </Text>
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <Text style={styles.tableHeaderCell}>Subject</Text>
                  <Text style={styles.tableHeaderCell}>Grade/Marks</Text>
                </View>
                {marksData.marks.map((subject, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={styles.tableCell}>{subject.subject}</Text>
                    <Text style={styles.tableCell}>
                      {subject.grade || subject.marks}
                    </Text>
                  </View>
                ))}
              </View>
              {examType === "external" && (
                <View style={styles.row}>
                  <Text style={styles.label}>SGPA:</Text>
                  <Text style={styles.value}>{marksData.sgpa}</Text>
                </View>
              )}
              {examType === "external" && (
                <View style={styles.row}>
                  <Text style={styles.label}>CGPA:</Text>
                  <Text style={styles.value}>{marksData.cgpa}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default StudentReportPDF;
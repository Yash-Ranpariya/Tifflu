
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

public class SchemaUpdater {
    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/tifflu_db_v2?allowPublicKeyRetrieval=true&useSSL=false";
        String user = "root";
        String password = "yash@32";

        try {
            // Load driver (should be in classpath from the spring boot jar)
            Class.forName("com.mysql.cj.jdbc.Driver");

            try (Connection conn = DriverManager.getConnection(url, user, password);
                    Statement stmt = conn.createStatement()) {

                System.out.println("Connected to database.");

                String sql = "ALTER TABLE Menu_Items ADD COLUMN is_chef_special BOOLEAN DEFAULT FALSE";

                try {
                    stmt.executeUpdate(sql);
                    System.out.println("Successfully added 'is_chef_special' column.");
                } catch (Exception e) {
                    if (e.getMessage().contains("Duplicate column name")) {
                        System.out.println("Column 'is_chef_special' already exists. Skipping.");
                    } else {
                        throw e;
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.exit(1);
        }
    }
}

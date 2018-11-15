exit unless ARGV[0]
base = '/home/aldi/Projects/TutorialsPoint/www.tutorialspoint.com/'+ARGV[0]+'/'
puts "Fixing Problem in "+base
Dir.glob(base+'*').each do |filename|
	begin
		content = File.read(filename)
		File.open(filename, 'w+') do |f|
			f.puts content.gsub('https://www.tutorialspoint.com', '')
		end
	rescue Errno::EISDIR
		puts "Failed"
	end
end
